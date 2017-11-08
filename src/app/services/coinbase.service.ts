import { Injectable, ErrorHandler, ApplicationRef } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { remote } from 'electron';
import { Subject }    from 'rxjs/Subject';

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
    private authenticated = new Subject<string>();

    public authenticated$ = this.authenticated.asObservable();
    public isAuthenticated: boolean;

    constructor(http: Http, private appRef:ApplicationRef) {
        this.http = http;

        if (this.accessObjectPresent()) {
            this.setAccessObjectFromLocalStorage();
        }
    }

    public authenticate() {
        if (!this.accessObject && !this.accessObjectPresent()) {
            this.setAuthenticated("authenticating");
            const webPreferences = {
                nodeIntegration: false
              }
            console.log("Show auth window");
            this.authWindow = new BrowserWindow({ width: 800, height: 600, show: false, webPreferences });
            this.showAuthWindow();
        } else if (this.accessObjectPresent()) {
            this.setAccessObjectFromLocalStorage();
        } else {
            console.log("Fell in pit, why?");
            console.log("accessObject: ", this.accessObject);
            console.log("accessObjectPresent: ", this.accessObjectPresent());
        }
    }

    private setAuthenticated(mode: string) {
        this.authenticated.next(mode);

        switch(mode) {
            case "authenticated":
                this.isAuthenticated = true;
                break;
            case "not_authenticated":
            case "revoked_access":
                this.isAuthenticated = false;
        }
        
        this.appRef.tick();
    }

    private accessObjectPresent(): boolean {
        return localStorage.getItem("coinbase_access_object") !== null;
    }

    private setAccessObjectFromLocalStorage() {
        this.accessObject = JSON.parse(localStorage.getItem("coinbase_access_object"));
        this.setAuthenticated("authenticated");
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
        const that = this;

        // Handle the response from Coinbase
        this.authWindow.webContents.on('will-navigate', (event, url) => {
            that.handleAuthCallback(url);
        });
    
        // Reset the authWindow on close
        this.authWindow.on('close', function () {
            console.log("Window closed");
            that.setAuthenticated("not_authenticated"); 
            that.accessObject = null;
        }, false);
    }

    private handleAuthCallback(url) {
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
          this.requestAuthToken(code);
        } else if (error) {
          alert('Oops! Something went wrong and we couldn\'t' +
            'log you in using Coinbase. Please try again.');
        }
    }

    private redirectUrlIsCorrect(url: string): boolean {
        return url.substr(0, 24) === COINBASE_REDIRECT_URL;
    }

    private requestRefreshToken(refreshToken: string) {
        this.requestToken({
            grant_type: "refresh_token",
            refresh_token: refreshToken
        });
    }

    private requestAuthToken(code) {
        this.requestToken({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: COINBASE_REDIRECT_URL,
            scope: "wallet:accounts:read"
        });
    }

    private requestToken(params: {}) {
        params = Object.assign(params, {
            client_id: COINBASE_CLIENT_ID,
            client_secret: COINBASE_API_SECRET,
        });

        // TODO: Refactor this to use coinbase package
        this.http.post('https://api.coinbase.com/oauth/token', params)
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
                this.setAuthenticated("authenticated");
            },
            err => console.log(err), 
            () => console.log('Authentication Complete')
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

    private handleError(error: any, callback: any) {
        switch(error) {
            case "ExpiredToken":
                this.requestRefreshToken(this.accessObject.refresh_token);
                break;
            default:
                console.log(error.name);
                console.log(error.status);
                console.log(error.message);
                break;
        }

        callback();
    }

    /* API CALLS */

    revokeAccess() {
        this.http.post('https://api.coinbase.com/oauth/revoke', {
            "token": this.accessObject.access_token
        })
        .subscribe(
            response => {
                this.accessObject = null;
                localStorage.removeItem("coinbase_access_object");
                this.setAuthenticated("revoked_access");
            },
            err => console.log(err), 
            () => console.log('Access revoked')
        );
    }

    getAccounts(callback: (accounts: CoinbaseAccount[]) => void) {
        if(!this.client) this.createNewClient();

        this.client.getAccounts({}, (err, accounts) => {
            if(err) {
                this.handleError(err, this.getAccounts(callback))
            }

            let coinbaseAccounts = [];
            accounts.forEach(account => {
                coinbaseAccounts.push(new CoinbaseAccount(account));
            });
            callback(coinbaseAccounts);
        });
    }

    getBuyPrice(cryptoCurrency: CryptoCurrencyType | string, currency: CurrencyType, callback: (price: string) => void) {
        if(!this.client) this.createNewClient();

        this.client.getBuyPrice({
            'currencyPair': cryptoCurrency.valueOf() + '-' + currency.valueOf()
        }, function(err, obj) {
            callback(obj.data.amount);
        });
    }

    getSellPrice(currency: CurrencyType, callback: (price: string) => void) {
        if(!this.client) this.createNewClient();

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