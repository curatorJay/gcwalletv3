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
import { Injectable } from '@angular/core';
import { Logger } from '../../providers/logger/logger';
// providers
import { AppIdentityProvider } from '../app-identity/app-identity';
import * as bitauthService from 'bitauth';
let BitPayProvider = class BitPayProvider {
    constructor(http, appIdentityProvider, logger) {
        this.http = http;
        this.appIdentityProvider = appIdentityProvider;
        this.logger = logger;
        this.logger.info('BitPayProvider initialized.');
        this.NETWORK = 'livenet';
        this.BITPAY_API_URL =
            this.NETWORK == 'livenet'
                ? 'https://bitpay.com'
                : 'https://test.bitpay.com';
    }
    getEnvironment() {
        return {
            network: this.NETWORK
        };
    }
    get(endpoint, successCallback, errorCallback) {
        let url = this.BITPAY_API_URL + endpoint;
        let headers = {
            'Content-Type': 'application/json'
        };
        this.http.get(url, { headers }).subscribe(data => {
            successCallback(data);
        }, data => {
            errorCallback(data);
        });
    }
    post(endpoint, json, successCallback, errorCallback) {
        this.appIdentityProvider.getIdentity(this.getEnvironment().network, (err, appIdentity) => {
            if (err) {
                return errorCallback(err);
            }
            let dataToSign = this.BITPAY_API_URL + endpoint + JSON.stringify(json);
            let signedData = bitauthService.sign(dataToSign, appIdentity.priv);
            let url = this.BITPAY_API_URL + endpoint;
            let headers = new HttpHeaders().set('content-type', 'application/json');
            headers = headers.append('x-identity', appIdentity.pub);
            headers = headers.append('x-signature', signedData);
            this.http.post(url, json, { headers }).subscribe(data => {
                successCallback(data);
            }, data => {
                errorCallback(data);
            });
        });
    }
    postAuth(json, successCallback, errorCallback) {
        this.appIdentityProvider.getIdentity(this.getEnvironment().network, (err, appIdentity) => {
            if (err) {
                return errorCallback(err);
            }
            json['params'].signature = bitauthService.sign(JSON.stringify(json.params), appIdentity.priv);
            json['params'].pubkey = appIdentity.pub;
            json['params'] = JSON.stringify(json.params);
            let url = this.BITPAY_API_URL + '/api/v2/';
            let headers = {
                'Content-Type': 'application/json'
            };
            this.logger.debug('post auth:' + JSON.stringify(json));
            this.http.post(url, json, { headers }).subscribe((data) => {
                data.appIdentity = appIdentity;
                successCallback(data);
            }, data => {
                errorCallback(data);
            });
        });
    }
};
BitPayProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient,
        AppIdentityProvider,
        Logger])
], BitPayProvider);
export { BitPayProvider };
//# sourceMappingURL=bitpay.js.map