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
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// providers
import { CoinbaseProvider } from '../../../providers/coinbase/coinbase';
import { ExternalLinkProvider } from '../../../providers/external-link/external-link';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PlatformProvider } from '../../../providers/platform/platform';
import { PopupProvider } from '../../../providers/popup/popup';
// pages
import { AmountPage } from '../../send/amount/amount';
import { CoinbaseTxDetailsPage } from './coinbase-tx-details/coinbase-tx-details';
import * as _ from 'lodash';
let CoinbasePage = class CoinbasePage {
    constructor(coinbaseProvider, logger, popupProvider, navCtrl, externalLinkProvider, platformProvider, onGoingProcessProvider, modalCtrl, navParams, formBuilder) {
        this.coinbaseProvider = coinbaseProvider;
        this.logger = logger;
        this.popupProvider = popupProvider;
        this.navCtrl = navCtrl;
        this.externalLinkProvider = externalLinkProvider;
        this.platformProvider = platformProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.modalCtrl = modalCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.pendingTransactions = { data: {} };
        this.isNW = false; // TODO: desktop
        this.oauthCodeForm = this.formBuilder.group({
            code: [
                '',
                Validators.compose([Validators.minLength(1), Validators.required])
            ]
        });
        this.isNW = this.platformProvider.isNW;
        this.isCordova = this.platformProvider.isCordova;
        this.showOauthForm = false;
    }
    ionViewWillEnter() {
        if (this.navParams.data.code) {
            this.coinbaseProvider.getStoredToken((at) => {
                if (!at)
                    this.submitOauthCode(this.navParams.data.code);
            });
        }
        else {
            this.init();
        }
    }
    init() {
        this.currency = this.coinbaseProvider.getAvailableCurrency();
        this.loading = true;
        this.coinbaseProvider.getStoredToken((at) => {
            this.accessToken = at;
            // Update Access Token if necessary
            this.coinbaseProvider.init((err, data) => {
                if (err || _.isEmpty(data)) {
                    this.loading = false;
                    if (err) {
                        this.logger.error(err);
                        let errorId = err.errors ? err.errors[0].id : null;
                        err = err.errors
                            ? err.errors[0].message
                            : err.error_description
                                ? err.error_description
                                : err.error || 'Unknown error';
                        this.popupProvider
                            .ionicAlert('Error connecting to Coinbase', err)
                            .then(() => {
                            if (errorId == 'revoked_token') {
                                this.coinbaseProvider.logout();
                            }
                            this.navCtrl.pop();
                        });
                    }
                    return;
                }
                // Show rates
                this.coinbaseProvider.buyPrice(data.accessToken, this.currency, (_, b) => {
                    this.buyPrice = b.data || null;
                    this.coinbaseProvider.sellPrice(data.accessToken, this.currency, (_, s) => {
                        this.sellPrice = s.data || null;
                        this.loading = false;
                    });
                });
                // Updating accessToken and accountId
                this.accessToken = data.accessToken;
                this.accountId = data.accountId;
                this.updateTransactions();
            });
        });
    }
    updateTransactions() {
        this.logger.debug('Getting transactions...');
        this.coinbaseProvider.getPendingTransactions(this.pendingTransactions);
    }
    openAuthenticateWindow() {
        let oauthUrl = this.getAuthenticateUrl();
        if (!this.isNW) {
            this.externalLinkProvider.open(oauthUrl);
        }
        else {
            let gui = window.require('nw.gui');
            gui.Window.open(oauthUrl, {
                focus: true,
                position: 'center'
            }, new_win => {
                new_win.on('loaded', () => {
                    let title = new_win.window.document.title;
                    if (title.indexOf('Coinbase') == -1) {
                        this.code = title;
                        this.submitOauthCode(this.code);
                        new_win.close();
                    }
                });
            });
        }
    }
    submitOauthCode(code) {
        this.onGoingProcessProvider.set('connectingCoinbase');
        this.coinbaseProvider.getToken(code, (err, accessToken) => {
            this.onGoingProcessProvider.clear();
            if (err) {
                this.popupProvider.ionicAlert('Error connecting to Coinbase', err);
                return;
            }
            this.accessToken = accessToken;
            this.init();
        });
    }
    getAuthenticateUrl() {
        this.showOauthForm = this.isCordova || this.isNW ? false : true;
        return this.coinbaseProvider.getOauthCodeUrl();
    }
    openSignupWindow() {
        let url = this.coinbaseProvider.getSignupUrl();
        let optIn = true;
        let title = 'Sign Up for Coinbase';
        let message = 'This will open Coinbase.com, where you can create an account.';
        let okText = 'Go to Coinbase';
        let cancelText = 'Back';
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    openSupportWindow() {
        let url = this.coinbaseProvider.getSupportUrl();
        let optIn = true;
        let title = 'Coinbase Support';
        let message = 'You can email support@coinbase.com for direct support, or you can view their help center.';
        let okText = 'Open Help Center';
        let cancelText = 'Go Back';
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    toggleOauthForm() {
        this.showOauthForm = !this.showOauthForm;
    }
    openTxModal(tx) {
        this.tx = tx;
        let modal = this.modalCtrl.create(CoinbaseTxDetailsPage, { tx: this.tx });
        modal.present();
        modal.onDidDismiss(data => {
            if (data.updateRequired)
                this.updateTransactions();
        });
    }
    goToBuyCoinbasePage() {
        this.navCtrl.push(AmountPage, {
            nextPage: 'BuyCoinbasePage',
            currency: this.currency,
            coin: 'btc',
            fixedUnit: true
        });
    }
    goToSellCoinbasePage() {
        this.navCtrl.push(AmountPage, {
            nextPage: 'SellCoinbasePage',
            currency: this.currency,
            coin: 'btc',
            fixedUnit: true
        });
    }
};
CoinbasePage = __decorate([
    Component({
        selector: 'page-coinbase',
        templateUrl: 'coinbase.html'
    }),
    __metadata("design:paramtypes", [CoinbaseProvider,
        Logger,
        PopupProvider,
        NavController,
        ExternalLinkProvider,
        PlatformProvider,
        OnGoingProcessProvider,
        ModalController,
        NavParams,
        FormBuilder])
], CoinbasePage);
export { CoinbasePage };
//# sourceMappingURL=coinbase.js.map