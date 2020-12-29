var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Logger } from '../../providers/logger/logger';
import * as BWC from 'bitcore-wallet-client';
let BwcProvider = class BwcProvider {
    constructor(logger) {
        this.logger = logger;
        this.buildTx = BWC.buildTx;
        this.parseSecret = BWC.parseSecret;
        this.Client = BWC;
        this.logger.info('BwcProvider initialized.');
    }
    getBitcore() {
        return BWC.Bitcore;
    }
    getBitcoreCash() {
        return BWC.BitcoreCash;
    }
    getErrors() {
        return BWC.errors;
    }
    getSJCL() {
        return BWC.sjcl;
    }
    getUtils() {
        return BWC.Utils;
    }
    getClient(walletData, opts) {
        opts = opts || {};
        // note opts use `bwsurl` all lowercase;
        let bwc = new BWC({
            baseUrl: opts.bwsurl || 'https://bws.bitpay.com/bws/api',
            verbose: opts.verbose,
            timeout: 100000,
            transports: ['polling']
        });
        if (walletData)
            bwc.import(walletData, opts);
        return bwc;
    }
};
BwcProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Logger])
], BwcProvider);
export { BwcProvider };
//# sourceMappingURL=bwc.js.map