import { Component, OnInit } from '@angular/core';

import { CoinbaseService } from '../../services/coinbase.service';

@Component({
  selector: 'app-coinbase',
  templateUrl: './coinbase.component.html',
  styleUrls: ['./coinbase.component.scss']
})
export class CoinbaseComponent implements OnInit {

  private _accounts: any;

  constructor(private coinbaseService: CoinbaseService) { }

  ngOnInit() {
    this._accounts = this.coinbaseService.getAccountsService();
  }

}
