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
import { Logger } from '../../../../../../providers/logger/logger';
// providers
import { ProfileProvider } from '../../../../../../providers/profile/profile';
import { WalletProvider } from '../../../../../../providers/wallet/wallet';
let WalletExtendedPrivateKeyPage = class WalletExtendedPrivateKeyPage {
    constructor(profileProvider, walletProvider, logger, navParams, navCtrl) {
        this.profileProvider = profileProvider;
        this.walletProvider = walletProvider;
        this.logger = logger;
        this.navParams = navParams;
        this.navCtrl = navCtrl;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad WalletExtendedPrivateKeyPage');
    }
    ionViewWillEnter() {
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.credentialsEncrypted = this.wallet.isPrivKeyEncrypted();
    }
    ionViewDidEnter() {
        this.walletProvider
            .getKeys(this.wallet)
            .then(k => {
            this.xPrivKey = k.xPrivKey;
            this.credentialsEncrypted = false;
        })
            .catch(err => {
            this.logger.error('Could not get keys: ', err);
            this.navCtrl.pop();
        });
    }
};
WalletExtendedPrivateKeyPage = __decorate([
    Component({
        selector: 'page-wallet-extended-private-key',
        templateUrl: 'wallet-extended-private-key.html'
    }),
    __metadata("design:paramtypes", [ProfileProvider,
        WalletProvider,
        Logger,
        NavParams,
        NavController])
], WalletExtendedPrivateKeyPage);
export { WalletExtendedPrivateKeyPage };
//# sourceMappingURL=wallet-extended-private-key.js.map