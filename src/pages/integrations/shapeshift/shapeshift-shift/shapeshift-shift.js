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
import { TranslateService } from '@ngx-translate/core';
import { Events, NavController } from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from '../../../../providers/logger/logger';
// Pages
import { AmountPage } from './../../../send/amount/amount';
// Providers
import { ExternalLinkProvider } from '../../../../providers/external-link/external-link';
import { PopupProvider } from '../../../../providers/popup/popup';
import { ProfileProvider } from '../../../../providers/profile/profile';
import { ShapeshiftProvider } from '../../../../providers/shapeshift/shapeshift';
let ShapeshiftShiftPage = class ShapeshiftShiftPage {
    constructor(events, externalLinkProvider, logger, navCtrl, popupProvider, profileProvider, shapeshiftProvider, translate) {
        this.events = events;
        this.externalLinkProvider = externalLinkProvider;
        this.logger = logger;
        this.navCtrl = navCtrl;
        this.popupProvider = popupProvider;
        this.profileProvider = profileProvider;
        this.shapeshiftProvider = shapeshiftProvider;
        this.translate = translate;
        this.walletsBtc = [];
        this.walletsBch = [];
        this.toWallets = [];
        this.fromWallets = [];
        this.fromWalletSelectorTitle = 'From';
        this.toWalletSelectorTitle = 'To';
        this.termsAccepted = false;
        this.network = this.shapeshiftProvider.getNetwork();
        this.walletsBtc = this.profileProvider.getWallets({
            onlyComplete: true,
            network: this.network,
            coin: 'btc'
        });
        this.walletsBch = this.profileProvider.getWallets({
            onlyComplete: true,
            network: this.network,
            coin: 'bch'
        });
        if (_.isEmpty(this.walletsBtc) || _.isEmpty(this.walletsBch)) {
            this.showErrorAndBack(null, this.translate.instant('No wallets available to use ShapeShift'));
            return;
        }
        this.fromWallets = _.filter(this.walletsBtc.concat(this.walletsBch), w => {
            // Available cached funds
            if (!w.cachedBalance)
                return null;
            let hasCachedFunds = w.cachedBalance.match(/0\.00 /gi) ? false : true;
            return hasCachedFunds;
        });
        if (_.isEmpty(this.fromWallets)) {
            this.showErrorAndBack(null, this.translate.instant('No wallets with funds'));
            return;
        }
        this.onFromWalletSelect(this.fromWallets[0]);
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad ShapeshiftShiftPage');
    }
    ionViewDidEnter() {
        this.termsAccepted = false;
    }
    openTerms() {
        let url = 'https://info.shapeshift.io/sites/default/files/ShapeShift_Terms_Conditions%20v1.1.pdf';
        this.externalLinkProvider.open(url);
    }
    showErrorAndBack(title, msg) {
        title = title ? title : this.translate.instant('Error');
        this.logger.error(msg);
        msg = msg && msg.errors ? msg.errors[0].message : msg;
        this.popupProvider.ionicAlert(title, msg).then(() => {
            this.navCtrl.pop();
        });
    }
    showToWallets() {
        this.toWallets =
            this.fromWallet.coin == 'btc' ? this.walletsBch : this.walletsBtc;
        this.onToWalletSelect(this.toWallets[0]);
        let pair = this.fromWallet.coin + '_' + this.toWallet.coin;
        this.shapeshiftProvider.getRate(pair, (_, rate) => {
            this.rate = rate;
            this.shapeshiftProvider.getMarketInfo(pair, (_, limit) => {
                this.limit = limit;
                if (this.limit['rate'] == 0 || this.rate['rate'] == 0) {
                    let msg = this.translate.instant('ShapeShift is not available at this moment. Please, try again later.');
                    this.popupProvider.ionicAlert(null, msg).then(() => {
                        this.navCtrl.pop();
                    });
                    return;
                }
            });
        });
    }
    onFromWalletSelect(wallet) {
        this.fromWallet = wallet;
        this.showToWallets();
    }
    onToWalletSelect(wallet) {
        this.toWallet = wallet;
    }
    setAmount() {
        if (!this.termsAccepted) {
            return;
        }
        if (this.toWallet.needsBackup) {
            let title = this.translate.instant('Needs backup');
            let msg = this.translate.instant('The destination wallet is not backed up. Please, complete the backup process before continue.');
            this.popupProvider.ionicAlert(title, msg);
            return;
        }
        this.navCtrl.push(AmountPage, {
            nextPage: 'ShapeshiftConfirmPage',
            fixedUnit: true,
            coin: this.fromWallet.coin,
            id: this.fromWallet.id,
            toWalletId: this.toWallet.id,
            shiftMax: this.limit.limit + ' ' + this.fromWallet.coin.toUpperCase(),
            shiftMin: this.limit.minimum + ' ' + this.fromWallet.coin.toUpperCase()
        });
    }
    showWallets(selector) {
        let walletsForActionSheet = [];
        let selectedWalletId;
        let title = selector == 'from'
            ? this.fromWalletSelectorTitle
            : this.toWalletSelectorTitle;
        if (selector == 'from') {
            walletsForActionSheet = this.fromWallets;
            selectedWalletId = this.fromWallet.id;
        }
        else if (selector == 'to') {
            walletsForActionSheet = this.toWallets;
            selectedWalletId = this.toWallet.id;
        }
        this.events.publish('showWalletsSelectorEvent', walletsForActionSheet, selectedWalletId, title);
        this.events.subscribe('selectWalletEvent', wallet => {
            if (!_.isEmpty(wallet))
                this.onWalletSelect(wallet, selector);
            this.events.unsubscribe('selectWalletEvent');
        });
    }
    onWalletSelect(wallet, selector) {
        if (selector == 'from') {
            this.onFromWalletSelect(wallet);
        }
        else if (selector == 'to') {
            this.onToWalletSelect(wallet);
        }
    }
};
ShapeshiftShiftPage = __decorate([
    Component({
        selector: 'page-shapeshift-shift',
        templateUrl: 'shapeshift-shift.html'
    }),
    __metadata("design:paramtypes", [Events,
        ExternalLinkProvider,
        Logger,
        NavController,
        PopupProvider,
        ProfileProvider,
        ShapeshiftProvider,
        TranslateService])
], ShapeshiftShiftPage);
export { ShapeshiftShiftPage };
//# sourceMappingURL=shapeshift-shift.js.map