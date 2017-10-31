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
    this.coinbaseStatus = "Nothing to see here...";

    if(!this.coinbaseService.authenticatedChange) {
      this.showLoginPage();
    } else {
      this.coinbaseStatus = "You are already logged in!";
    }
  }

  showLoginPage() {
    this.isAuthenticating = true;
    this.coinbaseService.showAuthWindow();

    this.coinbaseService.authenticatedChange.subscribe(() => {
      this.isAuthenticating = false;
      this.coinbaseStatus = "You are now logged in!";

      this.getCurrentBuyPrice(); // TODO: Remove this after testing
    });
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
