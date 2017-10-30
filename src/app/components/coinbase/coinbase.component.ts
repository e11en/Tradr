import { Component, OnInit } from '@angular/core';

import { CoinbaseInstance, CoinbaseAccount } from '../../models/coinbase.model';
import { CoinbaseService } from '../../services/coinbase.service';

@Component({
  selector: 'app-coinbase',
  templateUrl: './coinbase.component.html',
  styleUrls: ['./coinbase.component.scss']
})
export class CoinbaseComponent implements OnInit {

  private _accounts: any;
  private _coinbaseInstance: CoinbaseInstance;

  constructor(private coinbaseService: CoinbaseService) { }

  ngOnInit() {
    this._coinbaseInstance = new CoinbaseInstance();

    this.coinbaseService.getAccounts((accounts: CoinbaseAccount[]) => {
      console.log(accounts);
        //this._coinbaseInstance.Accounts = accounts;
    });
  }

}
