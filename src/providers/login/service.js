var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
// import { HttpClientModule } from '@angular/common/http'; 
// import { HttpModule } from '@angular/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map'; //** THis is backward compatibility, but not necessary for this app (angular5) */
import 'rxjs/add/operator/toPromise';
import { Logger } from '../../providers/logger/logger';
/*
  Generated class for the Login provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let LoginProvider = class LoginProvider {
    constructor(http, htttp, platform, logger) {
        this.http = http;
        this.htttp = htttp;
        this.platform = platform;
        this.logger = logger;
        console.log('this is the login service');
        this.apiurl = 'https://api.customer-portal.dev.getcns.tech';
        this.transactionsurl = 'https://api.customer-portal.dev.getcns.tech/transactions';
    }
    createHeaders2(username, password) {
        this.options = new RequestOptions({
            headers: new Headers({
                "Authorization": "Basic " + btoa(username + ':' + password),
                "Content-Type": "application/x-www-form-urlencoded"
            })
        });
    }
    createHeaders() {
        this.options = new RequestOptions({
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            })
        });
    }
    register(data) {
        this.createHeaders();
        return this.http.post(this.apiurl + '/register', data, this.options);
    }
    getTransactions(cookie, data) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': cookie
        });
        return this.http.post(this.apiurl + '/transactions', data, { headers: headers, observe: "response", withCredentials: true, responseType: "json" });
    }
    reset(data) {
        this.createHeaders();
        return this.http.post(this.apiurl + '/confirm', data.toString(), this.options);
    }
    login(uname, pword, url) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            "Authorization": "Basic " + btoa(uname + ':' + pword)
        });
        return this.http.get(this.apiurl + url, { headers: headers, observe: "response", withCredentials: true, responseType: "json" });
    }
    loginUser(uname, pword) {
        const httpOptions = {
            headers: new HttpHeaders({
                // 'Content-Type':  'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": "Basic " + btoa(uname + ':' + pword)
                // "Access-Control-Allow-Origin": "*"
            }),
            withCredentials: true
        };
        return new Promise((resolve, reject) => {
            this.http.get(this.apiurl + '/auth', httpOptions)
                .subscribe(res => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
};
LoginProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient,
        Http,
        Platform,
        Logger])
], LoginProvider);
export { LoginProvider };
//# sourceMappingURL=service.js.map