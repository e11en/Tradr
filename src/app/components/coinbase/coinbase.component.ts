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
    this.coinbaseStatus = "Not logged in";

    if(this.coinbaseService.isAuthenticated) {
      this.coinbaseStatus = "You are already logged in!";
    } 
    else {
      this.coinbaseService.authenticated$.subscribe(authenticated => {
        if(authenticated) {
          this.isAuthenticating = false;
          this.coinbaseStatus = "You are now logged in!";
        }
  
        //this.getCurrentBuyPrice(); // TODO: Remove this after testing
      });

      this.isAuthenticating = true;
      this.coinbaseService.authenticate();
    }
  }


  getAccountData() {
    if (!this.coinbaseService.isAuthenticated) return;

    this.coinbaseService.getAccounts((accounts: CoinbaseAccount[]) => {
      this.coinbaseInstance.Accounts = accounts;
    });
  }

  getCurrentBuyPrice() {
    if (!this.coinbaseService.isAuthenticated) return;
    
    this.coinbaseService.getBuyPrice(CryptoCurrencyType.Bitcoin, CurrencyType.Euro, (price: string) => {
      console.log("EUR to BTC price is", price);
    });
  }

}
