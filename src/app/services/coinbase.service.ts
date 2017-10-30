import { Injectable } from '@angular/core';
import { COINBASE_API_KEY, COINBASE_API_SECRET } from '../../api.keys';

import { CoinbaseInstance, CoinbaseAccount } from '../models/coinbase.model';
const coinbase = require('coinbase');

@Injectable()
export class CoinbaseService {

    private _client: any;

    constructor() {
        this._client= new coinbase.Client({'apiKey': COINBASE_API_KEY, 'apiSecret': COINBASE_API_SECRET});
    }

    getAccounts(callback: (accounts: CoinbaseAccount[]) => void) {
        this._client.getAccounts({}, (err, accounts) => {
            callback(accounts);
        });
    }    
}