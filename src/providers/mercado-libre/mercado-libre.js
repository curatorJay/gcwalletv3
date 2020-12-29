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
import { ConfigProvider } from '../config/config';
import { HomeIntegrationsProvider } from '../home-integrations/home-integrations';
import { PersistenceProvider } from '../persistence/persistence';
import * as _ from 'lodash';
let MercadoLibreProvider = class MercadoLibreProvider {
    // private availableCountries;
    constructor(persistenceProvider, homeIntegrationsProvider, http, logger, configProvider) {
        this.persistenceProvider = persistenceProvider;
        this.homeIntegrationsProvider = homeIntegrationsProvider;
        this.http = http;
        this.logger = logger;
        this.configProvider = configProvider;
        this.logger.info('MercadoLibreProvider initialized');
        // Not used yet
        /* this.availableCountries = [{
          'country': 'Brazil',
          'currency': 'BRL',
          'name': 'Mercado Livre',
          'url': 'https://www.mercadolivre.com.br'
        }]; */
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
    }
    getNetwork() {
        return this.credentials.NETWORK;
    }
    savePendingGiftCard(gc, opts, cb) {
        let network = this.getNetwork();
        this.persistenceProvider
            .getMercadoLibreGiftCards(network)
            .then(oldGiftCards => {
            if (_.isString(oldGiftCards)) {
                oldGiftCards = JSON.parse(oldGiftCards);
            }
            if (_.isString(gc)) {
                gc = JSON.parse(gc);
            }
            let inv = oldGiftCards || {};
            inv[gc.invoiceId] = gc;
            if (opts && (opts.error || opts.status || opts.archived)) {
                inv[gc.invoiceId] = _.assign(inv[gc.invoiceId], opts);
            }
            if (opts && opts.remove) {
                delete inv[gc.invoiceId];
            }
            inv = JSON.stringify(inv);
            this.persistenceProvider.setMercadoLibreGiftCards(network, inv);
            return cb();
        });
    }
    getPendingGiftCards(cb) {
        const network = this.getNetwork();
        return this.persistenceProvider
            .getMercadoLibreGiftCards(network)
            .then(giftCards => {
            var _gcds = giftCards ? giftCards : null;
            return cb(null, _gcds);
        });
    }
    createBitPayInvoice(data, cb) {
        let dataSrc = {
            currency: data.currency,
            amount: data.amount,
            clientId: data.uuid,
            email: data.email,
            buyerSelectedTransactionCurrency: data.buyerSelectedTransactionCurrency
        };
        let url = this.credentials.BITPAY_API_URL + '/mercado-libre-gift/pay';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        this.http.post(url, dataSrc, { headers }).subscribe(data => {
            this.logger.info('BitPay Create Invoice: SUCCESS');
            return cb(null, data);
        }, data => {
            this.logger.error('BitPay Create Invoice: ERROR', JSON.stringify(data));
            return cb(data);
        });
    }
    getBitPayInvoice(id, cb) {
        let url = this.credentials.BITPAY_API_URL + '/invoices/' + id;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        this.http.get(url, { headers }).subscribe((data) => {
            this.logger.info('BitPay Get Invoice: SUCCESS');
            return cb(null, data.data);
        }, data => {
            this.logger.error('BitPay Get Invoice: ERROR', JSON.stringify(data));
            return cb(data);
        });
    }
    createGiftCard(data, cb) {
        var dataSrc = {
            clientId: data.uuid,
            invoiceId: data.invoiceId,
            accessKey: data.accessKey
        };
        let url = this.credentials.BITPAY_API_URL + '/mercado-libre-gift/redeem';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        this.http.post(url, dataSrc, { headers }).subscribe((data) => {
            var status = data.status == 'new'
                ? 'PENDING'
                : data.status == 'paid'
                    ? 'PENDING'
                    : data.status;
            data.status = status;
            this.logger.info('Mercado Libre Gift Card Create/Update: ' + status);
            return cb(null, data);
        }, data => {
            this.logger.error('Mercado Libre Gift Card Create/Update: ERROR', JSON.stringify(data));
            return cb(data);
        });
    }
    /*
   * Disabled for now *
   */
    /*
    public cancelGiftCard(data, cb) {
  
      var dataSrc = {
        "clientId": data.uuid,
        "invoiceId": data.invoiceId,
        "accessKey": data.accessKey
      };
      let url = this.credentials.BITPAY_API_URL + '/mercado-libre-gift/cancel';
      let headers = {
        'content-type': 'application/json'
      };
      this.http.post(url, dataSrc, headers).subscribe((data) => {
        this.logger.info('Mercado Libre Gift Card Cancel: SUCCESS');
        return cb(null, data);
      }, (data) => {
        this.logger.error('Mercado Libre Gift Card Cancel: ' + data.message);
        return cb(data);
      });
    };
    */
    register() {
        this.homeIntegrationsProvider.register({
            name: 'mercadolibre',
            title: 'Mercado Livre Brazil Gift Cards',
            icon: 'assets/img/mercado-libre/icon-ml.svg',
            page: 'MercadoLibrePage',
            show: !!this.configProvider.get().showIntegration['mercadolibre']
        });
    }
};
MercadoLibreProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PersistenceProvider,
        HomeIntegrationsProvider,
        HttpClient,
        Logger,
        ConfigProvider])
], MercadoLibreProvider);
export { MercadoLibreProvider };
//# sourceMappingURL=mercado-libre.js.map