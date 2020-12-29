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
import { TranslateService } from '@ngx-translate/core';
import { Logger } from '../../providers/logger/logger';
// providers
import { BwcProvider } from '../../providers/bwc/bwc';
import { ConfigProvider } from '../../providers/config/config';
import * as _ from 'lodash';
let FeeProvider = class FeeProvider {
    constructor(configProvider, logger, bwcProvider, translate) {
        this.configProvider = configProvider;
        this.logger = logger;
        this.bwcProvider = bwcProvider;
        this.translate = translate;
        this.CACHE_TIME_TS = 60;
        this.cache = {
            updateTs: 0,
            coin: ''
        };
        this.logger.info('FeeProvider initialized.');
    }
    getFeeOpts() {
        const feeOpts = {
            urgent: this.translate.instant('Urgent'),
            priority: this.translate.instant('Priority'),
            normal: this.translate.instant('Normal'),
            economy: this.translate.instant('Economy'),
            superEconomy: this.translate.instant('Super Economy'),
            custom: this.translate.instant('Custom')
        };
        return feeOpts;
    }
    getCurrentFeeLevel() {
        return this.configProvider.get().wallet.settings.feeLevel || 'normal';
    }
    getFeeRate(coin, network, feeLevel) {
        return new Promise((resolve, reject) => {
            if (feeLevel == 'custom')
                return resolve();
            network = network || 'livenet';
            this.getFeeLevels(coin)
                .then(response => {
                let feeLevelRate;
                if (response.fromCache) {
                    feeLevelRate = _.find(response.levels[network], o => {
                        return o.level == feeLevel;
                    });
                }
                else {
                    feeLevelRate = _.find(response.levels[network], o => {
                        return o.level == feeLevel;
                    });
                }
                if (!feeLevelRate || !feeLevelRate.feePerKb) {
                    let msg = this.translate.instant('Could not get dynamic fee for level:') +
                        ' ' +
                        feeLevel;
                    return reject(msg);
                }
                let feeRate = feeLevelRate.feePerKb;
                if (!response.fromCache)
                    this.logger.debug('Dynamic fee: ' +
                        feeLevel +
                        '/' +
                        network +
                        ' ' +
                        (feeLevelRate.feePerKb / 1000).toFixed() +
                        ' SAT/B');
                return resolve(feeRate);
            })
                .catch(err => {
                return reject(err);
            });
        });
    }
    getCurrentFeeRate(coin, network) {
        return new Promise((resolve, reject) => {
            this.getFeeRate(coin, network, this.getCurrentFeeLevel())
                .then((data) => {
                return resolve(data);
            })
                .catch(err => {
                return reject(err);
            });
        });
    }
    getFeeLevels(coin) {
        return new Promise((resolve, reject) => {
            coin = coin || 'btc';
            if (this.cache.coin == coin &&
                this.cache.updateTs > Date.now() - this.CACHE_TIME_TS * 1000) {
                return resolve({ levels: this.cache.data, fromCache: true });
            }
            let walletClient = this.bwcProvider.getClient(null, {});
            walletClient.getFeeLevels(coin, 'livenet', (errLivenet, levelsLivenet) => {
                if (errLivenet) {
                    return reject(this.translate.instant('Could not get dynamic fee'));
                }
                walletClient.getFeeLevels('btc', 'testnet', (errTestnet, levelsTestnet) => {
                    if (errTestnet) {
                        return reject(this.translate.instant('Could not get dynamic fee'));
                    }
                    this.cache.updateTs = Date.now();
                    this.cache.coin = coin;
                    this.cache.data = {
                        livenet: levelsLivenet,
                        testnet: levelsTestnet
                    };
                    return resolve({ levels: this.cache.data });
                });
            });
        });
    }
};
FeeProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigProvider,
        Logger,
        BwcProvider,
        TranslateService])
], FeeProvider);
export { FeeProvider };
//# sourceMappingURL=fee.js.map