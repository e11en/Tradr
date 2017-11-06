import { Injectable, EventEmitter, ErrorHandler } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { remote } from 'electron';

import { COINBASE_CLIENT_ID, COINBASE_API_SECRET, COINBASE_REDIRECT_URL } from '../../api.keys';

import { CoinbaseInstance, CoinbaseAccount } from '../models/coinbase.model';

const coinbase = require('coinbase');
const BrowserWindow = remote.BrowserWindow;
const localStorage = window.localStorage;

export enum CryptoCurrencyType {
    Bitcoin = "BTC",
    LiteCoin = "LTC",
    Ethereum = "ETH"
}

export enum CurrencyType {
    USD = "USD",
    Euro = "EUR"
}
@Injectable()
export class CoinbaseService {

    private client: any;
    private authWindow: any;
    private http: Http;
    private accessObject: {
        access_token: string,
        token_type: string, 
        expires_in: number,
        refresh_token: string,
        scope: string
    }; // Do we want to create a model for this?

    public authenticatedChange: EventEmitter<void>;
    public isAuthenticated: boolean;

    constructor(http: Http) {
        this.authenticatedChange = new EventEmitter();
        this.http = http;

        if (!this.accessObject && !this.accessObjectPresent()) {
            this.isAuthenticated = false;
            const webPreferences = {
                nodeIntegration: false
              }
            this.authWindow = new BrowserWindow({ width: 800, height: 600, show: false, webPreferences });
            this.showAuthWindow();
        } else if (this.accessObjectPresent()) {
            this.setAccessObjectFromLocalStorage();
        }
    }

    private accessObjectPresent(): boolean {
        return localStorage.getItem("coinbase_access_object") !== null;
    }

    private setAccessObjectFromLocalStorage() {
        this.accessObject = JSON.parse(localStorage.getItem("coinbase_access_object"));
        this.isAuthenticated = true;
        this.authenticatedChange.complete();
    }

    // Used example https://github.com/joaogarin/angular-electron/blob/master/src/app/services/authentication.ts
    private showAuthWindow() {
        // Build the OAuth consent page URL
        const coinbaseUrl = "https://www.coinbase.com/oauth/authorize?";
        const responseType = "code";
        const clientId = COINBASE_CLIENT_ID;
        const redirectUri = COINBASE_REDIRECT_URL;
        const state =  this.guid();
        const scope = "wallet:accounts:read"; // TODO: Determine the permissions

        let authUrl = coinbaseUrl + "response_type=" + responseType + "&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&state=" + state + "&scope=" + scope;
        this.authWindow.loadURL(authUrl);
        this.authWindow.show();

        // Handle the response from Coinbase
        this.authWindow.webContents.on('will-navigate', (event, url) => {
            this.handleCallback(url);
        });
    
        // Reset the authWindow on close
        this.authWindow.on('close', function () {
            console.log("Window closed");
            this.authWindow = null;
        }, false);
    }

    private handleCallback(url) {
        // Don't proccess further if the redirect url isn't correct
        if(!this.redirectUrlIsCorrect(url)) {
            return;
        }

        let raw_code = /code=([^&]*)/.exec(url) || null;
        let code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
        let error = /\?error=(.+)$/.exec(url);
    
        // Close the browser
        this.authWindow.destroy();
    
        // If there is a code, proceed to get token from Coinbase
        if (code) {
          this.requestToken(code);
        } else if (error) {
          alert('Oops! Something went wrong and we couldn\'t' +
            'log you in using Coinbase. Please try again.');
        }
    }

    private redirectUrlIsCorrect(url: string): boolean {
        return url.substr(0, 24) === COINBASE_REDIRECT_URL;
    }

    private requestToken(code) {
        this.http.post('https://api.coinbase.com/oauth/token', 
        { 
            grant_type: "authorization_code",
            code: code,
            client_id: COINBASE_CLIENT_ID,
            client_secret: COINBASE_API_SECRET,
            redirect_uri: COINBASE_REDIRECT_URL
        })
        .subscribe(
            response => {
                const body = JSON.parse(response["_body"]);
                this.accessObject = {
                    access_token: body.access_token,
                    token_type: body.token_type, 
                    expires_in: body.expires_in,
                    refresh_token: body.refresh_token,
                    scope: body.scope
                };
                localStorage.setItem("coinbase_access_object", JSON.stringify(this.accessObject));
                this.isAuthenticated = true;
                this.authenticatedChange.complete();
            },
            err => console.log(err), () => console.log('Authentication Complete')
        );
    }

    private guid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
               this.s4() + '-' + this.s4() + this.s4() + this.s4();
      }
      
    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
    }

    private createNewClient() {
        // TODO: Handle errors
        this.client = new coinbase.Client({
            'accessToken': this.accessObject.access_token, 
            'refreshToken': this.accessObject.refresh_token
        });
    }

    getAccounts(callback: (accounts: CoinbaseAccount[]) => void) {
        if(!this.client) this.createNewClient();

        this.client.getAccounts({}, (err, accounts) => {
            let coinbaseAccounts = [];
            accounts.forEach(account => {
                coinbaseAccounts.push(new CoinbaseAccount(account));
            });
            callback(coinbaseAccounts);
        });
    }

    getBuyPrice(cryptoCurrency: CryptoCurrencyType, currency: CurrencyType, callback: (price: string) => void) {
        this.client.getBuyPrice({
            'currencyPair': cryptoCurrency.valueOf() + '-' + currency.valueOf()
        }, function(err, obj) {
            console.log('response data: ', obj.data); // TODO: Remove this after testing
            callback(obj.data.amount);
        });
    }

    getSellPrice(currency: CurrencyType, callback: (price: string) => void) {
        this.client.getSellPrice({
            'currency': currency.valueOf()
        }, function(err, obj) {
            console.log('response data: ', obj.data); // TODO: Remove this after testing
            callback(obj.data.amount);
        });
    }



    sell(account: CoinbaseAccount, currency: CryptoCurrencyType, amount: number) {
        // if(!this.client) this.createNewClient();

        // const args = {
        //     "amount": amount.toString(),
        //     "currency": currency.valueOf() // TODO: Does this have the expected behaviour
        // };
        // this.client.getAccount(account.Id, function(err, account) {
        //     account.sell(args, function(err, xfer) {
        //         console.log('my xfer id is: ' + xfer.id);
        //     });
        // });
    }

   
}