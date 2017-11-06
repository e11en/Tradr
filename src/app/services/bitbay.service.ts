import { Injectable, EventEmitter, ErrorHandler } from '@angular/core';
import { Http, Headers } from '@angular/http';
const CryptoJS = require("crypto-js");

const API_ADDRESS = "https://bitbay.net/API/Trading/tradingApi.php";
const localStorage = window.localStorage;
const API_SECRET = localStorage.getItem("BITBAY_API_SECRET"); // TODO: Create and check this item
const API_KEY = localStorage.getItem("BITBAY_API_KEY"); // TODO: Create and check this item

@Injectable()
export class BitBayService {

    private http: Http;

    constructor(http: Http) {
        this.http = http;

        console.log(this.sendRequest("info", {currency: "BTC"}));
    }

    private createAuthorizationHeader(params: any[]) : Headers {
        const sign = CryptoJS.HmacSHA1(params, API_SECRET);

        return new Headers([{
            "API-Key": API_KEY,
            "API-Hash": sign
        }]);
    }
    
    private sendRequest(method: string, content: {}) {
        // let params = [{
        //     "method": method,
        //     "moment": new Date().getTime()
        // }];
        // let headers = this.createAuthorizationHeader(params);
        // headers.append('Content-Type', 'application/json');

        // return this.http.post(API_ADDRESS, JSON.stringify(content), {
        //   headers: headers
        // }).map(res => res.json()).subscribe(
        //     data => { console.log(data); },
        //     err => { console.log(err); }
        // );
    }

    public getAccountBalance(currency: string) {
        return this.sendRequest("info", {currency: currency});
    }

    public placeOffer(params: {type: string, currency: string, amount: number, paymen_currency: string, rate: number}) {
        return this.sendRequest("trade", params);
    }

    public cancelOffer(params: {id: string}) {
        return this.sendRequest("cancel", params);
    }

    public checkOrderBook(params: {id: string}) {
        return this.sendRequest("orderbook", params);
    }

    public listOrders(params: {limit?: number}) {
        return this.sendRequest("orders", params);
    }

    public transferToWallet(params: {currency: string, quantity: number, address: string}) {
        return this.sendRequest("transfer", params);
    }

    public withdraw(params: {currency: string, quantity: number, account: string, express: boolean, bic: string}) {
        return this.sendRequest("withdraw ", params);
    }

    public getHistory(params: {currency: string, limit: number}) {
        return this.sendRequest("history", params);
    }

    public getTransactionHistory(params: {market?: string}) {
        return this.sendRequest("transactions", params);
    }
}
