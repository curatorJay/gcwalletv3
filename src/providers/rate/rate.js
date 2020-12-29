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
import env from '../../environments';
import { Logger } from '../../providers/logger/logger';
let RateProvider = class RateProvider {
    constructor(http, logger) {
        this.http = http;
        this.logger = logger;
        this.rateServiceUrl = env.ratesAPI.btc;
        this.bchRateServiceUrl = env.ratesAPI.bch;
        this.logger.info('RateProvider initialized.');
        this.rates = {};
        this.alternatives = [];
        this.ratesBCH = {};
        this.SAT_TO_BTC = 1 / 1e8;
        this.BTC_TO_SAT = 1e8;
        this.ratesBtcAvailable = false;
        this.ratesBchAvailable = false;
        this.updateRatesBtc();
        this.updateRatesBch();
    }
    updateRatesBtc() {
        return new Promise((resolve, reject) => {
            this.getBTC()
                .then(dataBTC => {
                _.each(dataBTC, currency => {
                    this.rates[currency.code] = currency.rate;
                    this.alternatives.push({
                        name: currency.name,
                        isoCode: currency.code,
                        rate: currency.rate
                    });
                });
                this.ratesBtcAvailable = true;
                resolve();
            })
                .catch(errorBTC => {
                this.logger.error(errorBTC);
                reject(errorBTC);
            });
        });
    }
    updateRatesBch() {
        return new Promise((resolve, reject) => {
            this.getBCH()
                .then(dataBCH => {
                _.each(dataBCH, currency => {
                    this.ratesBCH[currency.code] = currency.rate;
                });
                this.ratesBchAvailable = true;
                resolve();
            })
                .catch(errorBCH => {
                this.logger.error(errorBCH);
                reject(errorBCH);
            });
        });
    }
    getBTC() {
        return new Promise(resolve => {
            this.http.get(this.rateServiceUrl).subscribe(data => {
                resolve(data);
            });
        });
    }
    getBCH() {
        return new Promise(resolve => {
            this.http.get(this.bchRateServiceUrl).subscribe(data => {
                resolve(data);
            });
        });
    }
    getRate(code, chain) {
        if (chain == 'bch')
            return this.ratesBCH[code];
        else
            return this.rates[code];
    }
    getAlternatives() {
        return this.alternatives;
    }
    isBtcAvailable() {
        return this.ratesBtcAvailable;
    }
    isBchAvailable() {
        return this.ratesBchAvailable;
    }
    toFiat(satoshis, code, chain) {
        if ((!this.isBtcAvailable() && chain == 'btc') ||
            (!this.isBchAvailable() && chain == 'bch')) {
            return null;
        }
        return satoshis * this.SAT_TO_BTC * this.getRate(code, chain);
    }
    fromFiat(amount, code, chain) {
        if ((!this.isBtcAvailable() && chain == 'btc') ||
            (!this.isBchAvailable() && chain == 'bch')) {
            return null;
        }
        return (amount / this.getRate(code, chain)) * this.BTC_TO_SAT;
    }
    listAlternatives(sort) {
        let alternatives = _.map(this.getAlternatives(), (item) => {
            return {
                name: item.name,
                isoCode: item.isoCode
            };
        });
        if (sort) {
            alternatives.sort((a, b) => {
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
            });
        }
        return _.uniqBy(alternatives, 'isoCode');
    }
    whenRatesAvailable(chain) {
        return new Promise(resolve => {
            if ((this.ratesBtcAvailable && chain == 'btc') ||
                (this.ratesBchAvailable && chain == 'bch'))
                resolve();
            else {
                if (chain == 'btc') {
                    this.updateRatesBtc().then(() => {
                        resolve();
                    });
                }
                if (chain == 'bch') {
                    this.updateRatesBch().then(() => {
                        resolve();
                    });
                }
            }
        });
    }
};
RateProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient, Logger])
], RateProvider);
export { RateProvider };
//# sourceMappingURL=rate.js.map