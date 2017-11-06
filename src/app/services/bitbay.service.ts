import { Injectable, EventEmitter, ErrorHandler } from '@angular/core';
import { Http, Headers } from '@angular/http';
const CryptoJS = require("crypto-js");

const API_ADDRESS = "https://bitbay.net/API/Trading/tradingApi.php";

@Injectable()
export class BitBayService {

    private http: Http;

    constructor(http: Http) {
        this.http = http;

        console.log(this.sendRequest("info", {currency: "BTC"}));
    }

    private createAuthorizationHeader(params: any[]) : Headers {
        const sign = CryptoJS.HmacSHA1(params, "KEY"); // TODO: Get the actual API_SECRET from the user some how

        let headers = new Headers();
        headers.append('API-Key', 'KEY'); // TODO: Get the actual API-KEY from user some how
        headers.append('API-Hash', sign);

        return headers;
    }
    
    private sendRequest(method: string, content: {}) {
        let params = [{
            "method": method,
            "moment": new Date().getTime()
        }];
        let headers = this.createAuthorizationHeader(params);
        headers.append('Content-Type', 'application/json');

        return this.http.post(API_ADDRESS, JSON.stringify(content), {
          headers: headers
        }).map(res => res.json()).subscribe(
            data => { console.log(data); },
            err => { console.log(err); }
        );
    }
}
