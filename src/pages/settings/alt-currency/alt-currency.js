var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// Providers
import { ConfigProvider } from '../../../providers/config/config';
import { PersistenceProvider } from '../../../providers/persistence/persistence';
import { ProfileProvider } from '../../../providers/profile/profile';
import { RateProvider } from '../../../providers/rate/rate';
import { WalletProvider } from '../../../providers/wallet/wallet';
import * as _ from 'lodash';
let AltCurrencyPage = class AltCurrencyPage {
    constructor(configProvider, logger, navCtrl, rate, profileProvider, persistenceProvider, walletProvider) {
        this.configProvider = configProvider;
        this.logger = logger;
        this.navCtrl = navCtrl;
        this.rate = rate;
        this.profileProvider = profileProvider;
        this.persistenceProvider = persistenceProvider;
        this.walletProvider = walletProvider;
        this.PAGE_COUNTER = 3;
        this.SHOW_LIMIT = 10;
        this.completeAlternativeList = [];
        this.altCurrencyList = [];
        this.unusedCurrencyList = [
            {
                isoCode: 'LTL'
            },
            {
                isoCode: 'BTC'
            }
        ];
    }
    ionViewWillEnter() {
        this.rate
            .whenRatesAvailable('btc')
            .then(() => {
            this.completeAlternativeList = this.rate.listAlternatives(true);
            let idx = _.keyBy(this.unusedCurrencyList, 'isoCode');
            let idx2 = _.keyBy(this.lastUsedAltCurrencyList, 'isoCode');
            this.completeAlternativeList = _.reject(this.completeAlternativeList, c => {
                return idx[c.isoCode] || idx2[c.isoCode];
            });
            this.altCurrencyList = this.completeAlternativeList.slice(0, 20);
        })
            .catch(err => {
            this.logger.error(err);
        });
        let config = this.configProvider.get();
        this.currentCurrency = config.wallet.settings.alternativeIsoCode;
        this.persistenceProvider
            .getLastCurrencyUsed()
            .then(lastUsedAltCurrency => {
            this.lastUsedAltCurrencyList = lastUsedAltCurrency
                ? lastUsedAltCurrency
                : [];
        })
            .catch(err => {
            this.logger.error(err);
        });
    }
    loadAltCurrencies(loading) {
        if (this.altCurrencyList.length === this.completeAlternativeList.length) {
            loading.complete();
            return;
        }
        setTimeout(() => {
            this.altCurrencyList = this.completeAlternativeList.slice(0, this.PAGE_COUNTER * this.SHOW_LIMIT);
            this.PAGE_COUNTER++;
            loading.complete();
        }, 300);
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad AltCurrencyPage');
    }
    save(newAltCurrency) {
        var opts = {
            wallet: {
                settings: {
                    alternativeName: newAltCurrency.name,
                    alternativeIsoCode: newAltCurrency.isoCode
                }
            }
        };
        this.configProvider.set(opts);
        this.saveLastUsed(newAltCurrency);
        this.walletProvider.updateRemotePreferences(this.profileProvider.getWallets());
        this.navCtrl.pop();
    }
    saveLastUsed(newAltCurrency) {
        this.lastUsedAltCurrencyList.unshift(newAltCurrency);
        this.lastUsedAltCurrencyList = _.uniqBy(this.lastUsedAltCurrencyList, 'isoCode');
        this.lastUsedAltCurrencyList = this.lastUsedAltCurrencyList.slice(0, 3);
        this.persistenceProvider
            .setLastCurrencyUsed(JSON.stringify(this.lastUsedAltCurrencyList))
            .then(() => { });
    }
    findCurrency(searchedAltCurrency) {
        this.altCurrencyList = _.filter(this.completeAlternativeList, item => {
            var val = item.name;
            var val2 = item.isoCode;
            return (_.includes(val.toLowerCase(), searchedAltCurrency.toLowerCase()) ||
                _.includes(val2.toLowerCase(), searchedAltCurrency.toLowerCase()));
        });
    }
};
AltCurrencyPage = __decorate([
    Component({
        selector: 'page-alt-currency',
        templateUrl: 'alt-currency.html'
    }),
    __metadata("design:paramtypes", [ConfigProvider,
        Logger,
        NavController,
        RateProvider,
        ProfileProvider,
        PersistenceProvider,
        WalletProvider])
], AltCurrencyPage);
export { AltCurrencyPage };
//# sourceMappingURL=alt-currency.js.map