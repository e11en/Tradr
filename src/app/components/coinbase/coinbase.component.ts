import { Component, OnInit } from '@angular/core';

import { CoinbaseInstance, CoinbaseAccount } from '../../models/coinbase.model';
import { CoinbaseService, CryptoCurrencyType, CurrencyType } from '../../services/coinbase.service';

@Component({
  selector: 'app-coinbase',
  templateUrl: './coinbase.component.html',
  styleUrls: ['./coinbase.component.scss']
})
export class CoinbaseComponent implements OnInit {

  private coinbaseInstance: CoinbaseInstance;
  private isAuthenticating: boolean;
  private coinbaseStatus: string;

  constructor(private coinbaseService: CoinbaseService) { }

  ngOnInit() {
    this.coinbaseInstance = new CoinbaseInstance();

    if(this.coinbaseService.isAuthenticated) {
      this.coinbaseStatus = "You are already logged in!";
      this.getAccountData();
    } else {
      this.coinbaseStatus = "Not logged in";
    }
    
    this.coinbaseService.authenticated$.subscribe(authenticated => {
      console.log("Event trigger: " + authenticated);

      switch(authenticated) {
        case "authenticating":
              this.isAuthenticating = true;
              break;
        case "authenticated":
              this.isAuthenticating = false;
              this.coinbaseStatus = "You are now logged in!";
              this.getAccountData();
              break;
        case "not_authenticated":
              this.isAuthenticating = false;
              break;
        case "revoked_access":
              this.isAuthenticating = false;
              this.coinbaseStatus = "Access revoked";
              break;
      }
    });
  }

  logoutCoinbase() {
    this.coinbaseService.revokeAccess();
    this.coinbaseInstance.Accounts = null;
  }

  loginCoinbase(){
    this.coinbaseService.authenticate();
  }

  getAccountData() {
    this.coinbaseService.getAccounts((accounts: CoinbaseAccount[]) => {
      this.coinbaseInstance.Accounts = accounts;

      this.coinbaseInstance.Accounts.forEach((account) => {
        if(!account.NativeBalance) {
          this.coinbaseService.getBuyPrice(account.Balance.currency, CurrencyType.Euro, (price) => {
              account.NativeBalance = {
                currency:  CurrencyType.Euro,
                amount: (parseFloat(account.Balance.amount) * parseFloat(price)).toFixed(2).toString()
              };
          });
        }
      });

     
    });
  }

  getCurrentBuyPrice() {
    this.coinbaseService.getBuyPrice(CryptoCurrencyType.Bitcoin, CurrencyType.Euro, (price: string) => {
      console.log("EUR to BTC price is", price);
    });
  }

}
