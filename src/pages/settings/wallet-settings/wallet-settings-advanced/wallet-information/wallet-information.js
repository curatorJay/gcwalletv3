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
import { App, Events, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../../../providers/logger/logger';
// providers
import { ConfigProvider } from '../../../../../providers/config/config';
import { ProfileProvider } from '../../../../../providers/profile/profile';
// pages
import { WalletExtendedPrivateKeyPage } from './wallet-extended-private-key/wallet-extended-private-key';
import * as _ from 'lodash';
import { TabsPage } from '../../../../tabs/tabs';
let WalletInformationPage = class WalletInformationPage {
    constructor(app, profileProvider, configProvider, navParams, navCtrl, events, logger) {
        this.app = app;
        this.profileProvider = profileProvider;
        this.configProvider = configProvider;
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.events = events;
        this.logger = logger;
        this.colorCounter = 1;
        this.BLACK_WALLET_COLOR = '#202020';
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad WalletInformationPage');
    }
    ionViewWillEnter() {
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.walletName = this.wallet.name;
        this.coin = this.wallet.coin;
        this.walletId = this.wallet.credentials.walletId;
        this.N = this.wallet.credentials.n;
        this.M = this.wallet.credentials.m;
        this.copayers = this.wallet.cachedStatus.wallet.copayers;
        this.copayerId = this.wallet.credentials.copayerId;
        this.balanceByAddress = this.wallet.balanceByAddress;
        this.account = this.wallet.credentials.account;
        this.network = this.wallet.credentials.network;
        this.addressType = this.wallet.credentials.addressType || 'P2SH';
        this.derivationStrategy =
            this.wallet.credentials.derivationStrategy || 'BIP45';
        this.basePath = this.wallet.credentials.getBaseAddressDerivationPath();
        this.pubKeys = _.map(this.wallet.credentials.publicKeyRing, 'xPubKey');
        this.externalSource = null;
        this.canSign = this.wallet.canSign();
        this.needsBackup = this.wallet.needsBackup;
    }
    saveBlack() {
        if (this.colorCounter != 5) {
            this.colorCounter++;
            return;
        }
        this.save(this.BLACK_WALLET_COLOR);
    }
    save(color) {
        let opts = {
            colorFor: {}
        };
        opts.colorFor[this.wallet.credentials.walletId] = color;
        this.configProvider.set(opts);
        this.events.publish('wallet:updated', this.wallet.credentials.walletId);
        this.app.getRootNavs()[0].setRoot(TabsPage);
    }
    openWalletExtendedPrivateKey() {
        this.navCtrl.push(WalletExtendedPrivateKeyPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
};
WalletInformationPage = __decorate([
    Component({
        selector: 'page-wallet-information',
        templateUrl: 'wallet-information.html'
    }),
    __metadata("design:paramtypes", [App,
        ProfileProvider,
        ConfigProvider,
        NavParams,
        NavController,
        Events,
        Logger])
], WalletInformationPage);
export { WalletInformationPage };
//# sourceMappingURL=wallet-information.js.map