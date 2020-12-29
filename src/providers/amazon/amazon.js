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
import { ConfigProvider } from '../config/config';
import { HomeIntegrationsProvider } from '../home-integrations/home-integrations';
import { PersistenceProvider } from '../persistence/persistence';
let AmazonProvider = class AmazonProvider {
    constructor(http, logger, persistenceProvider, homeIntegrationsProvider, configProvider) {
        this.http = http;
        this.logger = logger;
        this.persistenceProvider = persistenceProvider;
        this.homeIntegrationsProvider = homeIntegrationsProvider;
        this.configProvider = configProvider;
        this.logger.info('AmazonProvider initialized.');
        this.credentials = {};
        /*
        * Development: 'testnet'
        * Production: 'livenet'
        */
        this.credentials.NETWORK = 'livenet';
        this.credentials.BITPAY_API_URL =
            this.credentials.NETWORK === 'testnet'
                ? 'https://test.bitpay.com'
                : 'https://bitpay.com';
        this.limitPerDay = 2000;
    }
    getNetwork() {
        return this.credentials.NETWORK;
    }
    savePendingGiftCard(gc, opts, cb) {
        var network = this.getNetwork();
        this.persistenceProvider.getAmazonGiftCards(network).then(oldGiftCards => {
            if (_.isString(oldGiftCards)) {
                oldGiftCards = JSON.parse(oldGiftCards);
            }
            if (_.isString(gc)) {
                gc = JSON.parse(gc);
            }
            var inv = oldGiftCards || {};
            inv[gc.invoiceId] = gc;
            if (opts && (opts.error || opts.status)) {
                inv[gc.invoiceId] = _.assign(inv[gc.invoiceId], opts);
            }
            if (opts && opts.remove) {
                delete inv[gc.invoiceId];
            }
            inv = JSON.stringify(inv);
            this.persistenceProvider.setAmazonGiftCards(network, inv);
            return cb(null);
        });
    }
    getPendingGiftCards(cb) {
        var network = this.getNetwork();
        this.persistenceProvider
            .getAmazonGiftCards(network)
            .then(giftCards => {
            return cb(null, giftCards ? giftCards : null);
        })
            .catch(err => {
            return cb(err);
        });
    }
    createBitPayInvoice(data, cb) {
        var dataSrc = {
            currency: data.currency,
            amount: data.amount,
            clientId: data.uuid,
            email: data.email,
            buyerSelectedTransactionCurrency: data.buyerSelectedTransactionCurrency
        };
        this.http
            .post(this.credentials.BITPAY_API_URL + '/amazon-gift/pay', dataSrc)
            .subscribe(data => {
            this.logger.info('BitPay Create Invoice: SUCCESS');
            return cb(null, data);
        }, data => {
            this.logger.error('BitPay Create Invoice: ERROR ' + data.error.message);
            return cb(data.error);
        });
    }
    getBitPayInvoice(id, cb) {
        this.http
            .get(this.credentials.BITPAY_API_URL + '/invoices/' + id)
            .subscribe((data) => {
            this.logger.info('BitPay Get Invoice: SUCCESS');
            return cb(null, data.data);
        }, data => {
            this.logger.error('BitPay Get Invoice: ERROR ' + data.error.message);
            return cb(data.error.message);
        });
    }
    createGiftCard(data, cb) {
        var dataSrc = {
            clientId: data.uuid,
            invoiceId: data.invoiceId,
            accessKey: data.accessKey
        };
        this.http
            .post(this.credentials.BITPAY_API_URL + '/amazon-gift/redeem', dataSrc)
            .subscribe((data) => {
            var status = data.status == 'new'
                ? 'PENDING'
                : data.status == 'paid'
                    ? 'PENDING'
                    : data.status;
            data.status = status;
            this.logger.info('Amazon.com Gift Card Create/Update: ' + status);
            return cb(null, data);
        }, data => {
            this.logger.error('Amazon.com Gift Card Create/Update: ' + data.message);
            return cb(data);
        });
    }
    cancelGiftCard(data, cb) {
        var dataSrc = {
            clientId: data.uuid,
            invoiceId: data.invoiceId,
            accessKey: data.accessKey
        };
        this.http
            .post(this.credentials.BITPAY_API_URL + '/amazon-gift/cancel', dataSrc)
            .subscribe(data => {
            this.logger.info('Amazon.com Gift Card Cancel: SUCCESS');
            return cb(null, data);
        }, data => {
            this.logger.error('Amazon.com Gift Card Cancel: ' + data.message);
            return cb(data);
        });
    }
    register() {
        this.homeIntegrationsProvider.register({
            name: 'amazon',
            title: 'Amazon.com Gift Cards',
            icon: 'assets/img/amazon/icon-amazon.svg',
            page: 'AmazonPage',
            show: !!this.configProvider.get().showIntegration['amazon']
        });
    }
};
AmazonProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient,
        Logger,
        PersistenceProvider,
        HomeIntegrationsProvider,
        ConfigProvider])
], AmazonProvider);
export { AmazonProvider };
//# sourceMappingURL=amazon.js.map