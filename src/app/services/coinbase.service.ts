import { Injectable } from '@angular/core';
import { COINBASE_API_KEY, COINBASE_API_SECRET } from '../../api.keys';

import { CoinbaseInstance, CoinbaseAccount } from '../models/coinbase.model';


@Injectable()
export class CoinbaseService {

    private _coinbase: any;
    private _client: any;
    public Instance: CoinbaseInstance;

    constructor() {
        this.Instance = new CoinbaseInstance();
        this._coinbase = require('coinbase');
        this._client= new this._coinbase.Client({'apiKey': COINBASE_API_KEY, 'apiSecret': COINBASE_API_SECRET});
    }

    getAccounts() {
        this._client.getAccounts({}, function(err, accounts) {
            accounts.forEach(function(account: CoinbaseAccount) {
                this.Instance.Account.push(account);
                //console.log('my bal: ' + acct.balance.amount + ' for ' + acct.name);
                //console.log(accont);
            });
            console.log(this.Instance);
          });
    };
}