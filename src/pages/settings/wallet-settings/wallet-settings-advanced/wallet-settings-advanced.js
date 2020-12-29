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
import { NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../../providers/logger/logger';
// providers
import { ProfileProvider } from '../../../../providers/profile/profile';
// pages
import { BitcoinCashPage } from './bitcoin-cash/bitcoin-cash';
import { WalletAddressesPage } from './wallet-addresses/wallet-addresses';
import { WalletDeletePage } from './wallet-delete/wallet-delete';
import { WalletExportPage } from './wallet-export/wallet-export';
import { WalletInformationPage } from './wallet-information/wallet-information';
import { WalletServiceUrlPage } from './wallet-service-url/wallet-service-url';
import { WalletTransactionHistoryPage } from './wallet-transaction-history/wallet-transaction-history';
let WalletSettingsAdvancedPage = class WalletSettingsAdvancedPage {
    constructor(profileProvider, navCtrl, navParams, logger) {
        this.profileProvider = profileProvider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.logger = logger;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad WalletSettingsAdvancedPage');
    }
    ionViewWillEnter() {
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
    }
    openWalletInformation() {
        this.navCtrl.push(WalletInformationPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    openWalletAddresses() {
        this.navCtrl.push(WalletAddressesPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    openExportWallet() {
        this.navCtrl.push(WalletExportPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    openWalletServiceUrl() {
        this.navCtrl.push(WalletServiceUrlPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    openTransactionHistory() {
        this.navCtrl.push(WalletTransactionHistoryPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    openDeleteWallet() {
        this.navCtrl.push(WalletDeletePage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    openBitcoinCashPage() {
        this.navCtrl.push(BitcoinCashPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
};
WalletSettingsAdvancedPage = __decorate([
    Component({
        selector: 'page-wallet-settings-advanced',
        templateUrl: 'wallet-settings-advanced.html'
    }),
    __metadata("design:paramtypes", [ProfileProvider,
        NavController,
        NavParams,
        Logger])
], WalletSettingsAdvancedPage);
export { WalletSettingsAdvancedPage };
//# sourceMappingURL=wallet-settings-advanced.js.map