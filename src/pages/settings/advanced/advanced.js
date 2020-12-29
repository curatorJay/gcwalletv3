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
import { Logger } from '../../../providers/logger/logger';
// providers
import { ConfigProvider } from '../../../providers/config/config';
let AdvancedPage = class AdvancedPage {
    constructor(configProvider, logger) {
        this.configProvider = configProvider;
        this.logger = logger;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad AdvancedPage');
    }
    ionViewWillEnter() {
        let config = this.configProvider.get();
        this.spendUnconfirmed = config.wallet.spendUnconfirmed;
        this.recentTransactionsEnabled = config.recentTransactions.enabled;
        this.useLegacyAddress = config.wallet.useLegacyAddress;
    }
    spendUnconfirmedChange() {
        let opts = {
            wallet: {
                spendUnconfirmed: this.spendUnconfirmed
            }
        };
        this.configProvider.set(opts);
    }
    recentTransactionsChange() {
        let opts = {
            recentTransactions: {
                enabled: this.recentTransactionsEnabled
            }
        };
        this.configProvider.set(opts);
    }
    useLegacyAddressChange() {
        let opts = {
            wallet: {
                useLegacyAddress: this.useLegacyAddress
            }
        };
        this.configProvider.set(opts);
    }
};
AdvancedPage = __decorate([
    Component({
        selector: 'page-advanced',
        templateUrl: 'advanced.html'
    }),
    __metadata("design:paramtypes", [ConfigProvider, Logger])
], AdvancedPage);
export { AdvancedPage };
//# sourceMappingURL=advanced.js.map