import { Injectable } from '@angular/core';
import { COINBASE_API_KEY, COINBASE_API_SECRET } from '../../api.keys';


@Injectable()
export class CoinbaseService {

    private _client: any;

    constructor() {
        
    }

    getAccountsService = () => {
        var coinbase = require('coinbase');
        this._client   = new coinbase.Client({'apiKey': COINBASE_API_KEY, 'apiSecret': COINBASE_API_SECRET});

        this._client.getAccounts({}, function(err, accounts) {
            accounts.forEach(function(acct) {
              console.log('my bal: ' + acct.balance.amount + ' for ' + acct.name);
            });
          });
    };
}