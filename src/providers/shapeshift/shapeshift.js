var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Logger } from '../../providers/logger/logger';
// providers
import { AppProvider } from '../app/app';
import { ConfigProvider } from '../config/config';
import { HomeIntegrationsProvider } from '../home-integrations/home-integrations';
import { PersistenceProvider } from '../persistence/persistence';
let ShapeshiftProvider = class ShapeshiftProvider {
    constructor(appProvider, homeIntegrationsProvider, http, logger, configProvider, persistenceProvider) {
        this.appProvider = appProvider;
        this.homeIntegrationsProvider = homeIntegrationsProvider;
        this.http = http;
        this.logger = logger;
        this.configProvider = configProvider;
        this.persistenceProvider = persistenceProvider;
        this.logger.info('Hello ShapeshiftProvider Provider');
        this.credentials = {};
        // (Optional) Affiliate PUBLIC KEY, for volume tracking, affiliate payments, split-shifts, etc.
        if (this.appProvider.servicesInfo &&
            this.appProvider.servicesInfo.shapeshift) {
            this.credentials.API_KEY =
                this.appProvider.servicesInfo.shapeshift.api_key || null;
        }
        /*
        * Development: 'testnet'
        * Production: 'livenet'
        */
        this.credentials.NETWORK = 'livenet';
        this.credentials.API_URL =
            this.credentials.NETWORK === 'testnet'
                ? ''
                : // CORS: cors.shapeshift.io
                    'https://shapeshift.io';
    }
    getNetwork() {
        return this.credentials.NETWORK;
    }
    shift(data, cb) {
        let dataSrc = {
            withdrawal: data.withdrawal,
            pair: data.pair,
            returnAddress: data.returnAddress,
            apiKey: this.credentials.API_KEY
        };
        this.http.post(this.credentials.API_URL + '/shift', dataSrc).subscribe(data => {
            this.logger.info('Shapeshift SHIFT: SUCCESS');
            return cb(null, data);
        }, data => {
            this.logger.error('Shapeshift SHIFT ERROR: ' + data.error.message);
            return cb(data);
        });
    }
    saveShapeshift(data, opts, cb) {
        let network = this.getNetwork();
        this.persistenceProvider
            .getShapeshift(network)
            .then(oldData => {
            if (_.isString(oldData)) {
                oldData = JSON.parse(oldData);
            }
            if (_.isString(data)) {
                data = JSON.parse(data);
            }
            let inv = oldData ? oldData : {};
            inv[data.address] = data;
            if (opts && (opts.error || opts.status)) {
                inv[data.address] = _.assign(inv[data.address], opts);
            }
            if (opts && opts.remove) {
                delete inv[data.address];
            }
            inv = JSON.stringify(inv);
            this.persistenceProvider.setShapeshift(network, inv);
            return cb(null);
        })
            .catch(err => {
            return cb(err);
        });
    }
    getShapeshift(cb) {
        let network = this.getNetwork();
        this.persistenceProvider
            .getShapeshift(network)
            .then(ss => {
            return cb(null, ss);
        })
            .catch(err => {
            return cb(err, null);
        });
    }
    getRate(pair, cb) {
        this.http.get(this.credentials.API_URL + '/rate/' + pair).subscribe(data => {
            this.logger.info('Shapeshift PAIR: SUCCESS');
            return cb(null, data);
        }, data => {
            this.logger.error('Shapeshift PAIR ERROR: ' + data.error.message);
            return cb(data);
        });
    }
    getLimit(pair, cb) {
        this.http.get(this.credentials.API_URL + '/limit/' + pair).subscribe(data => {
            this.logger.info('Shapeshift LIMIT: SUCCESS');
            return cb(null, data);
        }, data => {
            this.logger.error('Shapeshift LIMIT ERROR: ' + data.error.message);
            return cb(data);
        });
    }
    getMarketInfo(pair, cb) {
        this.http.get(this.credentials.API_URL + '/marketinfo/' + pair).subscribe(data => {
            this.logger.info('Shapeshift MARKET INFO: SUCCESS');
            return cb(null, data);
        }, data => {
            this.logger.error('Shapeshift MARKET INFO ERROR', data.error.message);
            return cb(data);
        });
    }
    getStatus(addr, cb) {
        this.http.get(this.credentials.API_URL + '/txStat/' + addr).subscribe(data => {
            this.logger.info('Shapeshift STATUS: SUCCESS');
            return cb(null, data);
        }, data => {
            this.logger.error('Shapeshift STATUS ERROR: ' + data.error.message);
            return cb(data);
        });
    }
    register() {
        this.homeIntegrationsProvider.register({
            name: 'shapeshift',
            title: 'ShapeShift',
            icon: 'assets/img/shapeshift/icon-shapeshift.svg',
            page: 'ShapeshiftPage',
            show: !!this.configProvider.get().showIntegration['shapeshift']
        });
    }
};
ShapeshiftProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AppProvider,
        HomeIntegrationsProvider,
        HttpClient,
        Logger,
        ConfigProvider,
        PersistenceProvider])
], ShapeshiftProvider);
export { ShapeshiftProvider };
//# sourceMappingURL=shapeshift.js.map