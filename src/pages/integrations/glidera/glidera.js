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
import { ExternalLinkProvider } from '../../../providers/external-link/external-link';
import { GlideraProvider } from '../../../providers/glidera/glidera';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../../providers/popup/popup';
// pages
import { AmountPage } from '../../send/amount/amount';
import { GlideraTxDetailsPage } from './glidera-tx-details/glidera-tx-details';
let GlideraPage = class GlideraPage {
    constructor(externalLinkProvider, onGoingProcessProvider, glideraProvider, popupProvider, logger, navParams, navCtrl, formBuilder, modalCtrl) {
        this.externalLinkProvider = externalLinkProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.glideraProvider = glideraProvider;
        this.popupProvider = popupProvider;
        this.logger = logger;
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.formBuilder = formBuilder;
        this.modalCtrl = modalCtrl;
        this.oauthCodeForm = this.formBuilder.group({
            code: [
                '',
                Validators.compose([Validators.minLength(1), Validators.required])
            ]
        });
        this.network = this.glideraProvider.getNetwork();
        this.currency = this.glideraProvider.getCurrency();
        this.showOauthForm = false;
        this.account = {};
    }
    ionViewDidEnter() {
        if (this.navParams.data && this.navParams.data.code)
            this.submitOauthCode(this.navParams.data.code);
        else
            this.init();
    }
    openExternalLink(url) {
        this.externalLinkProvider.open(url);
    }
    init() {
        this.onGoingProcessProvider.set('connectingGlidera');
        this.glideraProvider.init((err, data) => {
            this.onGoingProcessProvider.clear();
            if (err) {
                this.popupProvider.ionicAlert('Error connecting Glidera', err + '. Please re-connect to Glidera');
                return;
            }
            if (!data || (data && !data.token))
                return;
            this.account.token = data.token;
            this.account.status = data.status;
            this.account.txs = data.txs;
            this.update();
        });
    }
    update() {
        this.logger.debug('Updating Glidera...');
        this.glideraProvider.updateStatus(this.account);
    }
    getAuthenticateUrl() {
        return this.glideraProvider.getOauthCodeUrl();
    }
    submitOauthCode(code) {
        this.onGoingProcessProvider.set('connectingGlidera');
        this.glideraProvider.authorize(code, (err, data) => {
            this.onGoingProcessProvider.clear();
            if (err) {
                this.popupProvider.ionicAlert('Authorization error', err);
                return;
            }
            this.account.token = data.token;
            this.account.status = data.status;
            this.init();
        });
    }
    openTxModal(tx) {
        this.tx = tx;
        let modal = this.modalCtrl.create(GlideraTxDetailsPage, { tx: this.tx });
        modal.present();
        this.glideraProvider.getTransaction(this.account.token, tx.transactionUuid, (err, tx) => {
            if (err) {
                this.popupProvider.ionicAlert('Error getting transaction', 'Could not get transactions');
                return;
            }
            this.tx = tx;
        });
    }
    openAuthenticateWindow() {
        this.openExternalLink(this.getAuthenticateUrl());
        this.navCtrl.popToRoot();
    }
    openLoginWindow() {
        let glideraUrl = this.network === 'testnet'
            ? 'https://sandbox.glidera.io/login'
            : 'https://glidera.io/login';
        this.openExternalLink(glideraUrl);
    }
    openSupportWindow() {
        var url = this.glideraProvider.getSupportUrl();
        var optIn = true;
        var title = 'Glidera Support';
        var message = 'You can email glidera at support@glidera.io for direct support, or you can contact Glidera on Twitter.';
        var okText = 'Tweet @GlideraInc';
        var cancelText = 'Go Back';
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    toggleOauthForm() {
        this.showOauthForm = !this.showOauthForm;
    }
    goToBuyGlideraPage() {
        this.navCtrl.push(AmountPage, {
            nextPage: 'BuyGlideraPage',
            currency: this.currency,
            coin: 'btc',
            fixedUnit: true
        });
    }
    goToSellGlideraPage() {
        this.navCtrl.push(AmountPage, {
            nextPage: 'SellGlideraPage',
            currency: this.currency,
            coin: 'btc',
            fixedUnit: true
        });
    }
};
GlideraPage = __decorate([
    Component({
        selector: 'page-glidera',
        templateUrl: 'glidera.html'
    }),
    __metadata("design:paramtypes", [ExternalLinkProvider,
        OnGoingProcessProvider,
        GlideraProvider,
        PopupProvider,
        Logger,
        NavParams,
        NavController,
        FormBuilder,
        ModalController])
], GlideraPage);
export { GlideraPage };
//# sourceMappingURL=glidera.js.map