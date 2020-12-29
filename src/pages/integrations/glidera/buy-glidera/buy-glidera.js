var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Component, ViewChild } from '@angular/core';
import { Events, ModalController, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../../providers/logger/logger';
// pages
import { FinishModalPage } from '../../../finish/finish';
import { GlideraPage } from '../../../integrations/glidera/glidera';
// providers
import { GlideraProvider } from '../../../../providers/glidera/glidera';
import { OnGoingProcessProvider } from '../../../../providers/on-going-process/on-going-process';
import { PlatformProvider } from '../../../../providers/platform/platform';
import { PopupProvider } from '../../../../providers/popup/popup';
import { ProfileProvider } from '../../../../providers/profile/profile';
import { TxFormatProvider } from '../../../../providers/tx-format/tx-format';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import * as _ from 'lodash';
import { setPrice } from '../../integrations';
let BuyGlideraPage = class BuyGlideraPage {
    constructor(platformProvider, events, logger, popupProvider, navCtrl, navParams, onGoingProcessProvider, glideraProvider, profileProvider, txFormatProvider, walletProvider, modalCtrl) {
        this.platformProvider = platformProvider;
        this.events = events;
        this.logger = logger;
        this.popupProvider = popupProvider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.glideraProvider = glideraProvider;
        this.profileProvider = profileProvider;
        this.txFormatProvider = txFormatProvider;
        this.walletProvider = walletProvider;
        this.modalCtrl = modalCtrl;
        this.coin = 'btc';
        this.isCordova = this.platformProvider.isCordova;
    }
    ionViewWillLeave() {
        this.navCtrl.swipeBackEnabled = true;
    }
    ionViewWillEnter() {
        this.isOpenSelector = false;
        this.navCtrl.swipeBackEnabled = false;
        this.isFiat = this.navParams.data.currency != 'BTC' ? true : false;
        this.amount = this.navParams.data.amount;
        this.currency = this.navParams.data.currency;
        this.network = this.glideraProvider.getNetwork();
        this.wallets = this.profileProvider.getWallets({
            onlyComplete: true,
            network: this.network,
            coin: this.coin
        });
        if (_.isEmpty(this.wallets)) {
            this.showErrorAndBack('No wallets available');
            return;
        }
        this.onWalletSelect(this.wallets[0]); // Default first wallet
    }
    showErrorAndBack(err) {
        if (this.isCordova)
            this.slideButton.isConfirmed(false);
        this.logger.error(err);
        err = err.errors ? err.errors[0].message : err || '';
        this.popupProvider.ionicAlert('Error', err).then(() => {
            this.navCtrl.pop();
        });
    }
    showError(err) {
        if (this.isCordova)
            this.slideButton.isConfirmed(false);
        this.logger.error(err);
        err = err.errors ? err.errors[0].message : err;
        this.popupProvider.ionicAlert('Error', err);
    }
    processPaymentInfo() {
        this.onGoingProcessProvider.set('connectingGlidera');
        this.glideraProvider.init((err, data) => {
            if (err) {
                this.onGoingProcessProvider.clear();
                this.showErrorAndBack(err);
                return;
            }
            this.token = data.token;
            var price = setPrice(this.isFiat, this.amount);
            this.glideraProvider.buyPrice(this.token, price, (err, buy) => {
                this.onGoingProcessProvider.clear();
                if (err) {
                    this.showErrorAndBack(err);
                    return;
                }
                this.buyInfo = buy;
            });
        });
    }
    ask2FaCode(mode, cb) {
        if (mode != 'NONE') {
            // SHOW PROMPT
            var title = 'Please, enter the code below';
            var message;
            if (mode == 'PIN') {
                message = 'You have enabled PIN based two-factor authentication.';
            }
            else if (mode == 'AUTHENTICATOR') {
                message = 'Use an authenticator app (Authy or Google Authenticator).';
            }
            else {
                message =
                    'A SMS containing a confirmation code was sent to your phone.';
            }
            this.popupProvider.ionicPrompt(title, message).then(twoFaCode => {
                if (typeof twoFaCode == 'undefined')
                    return cb();
                return cb(twoFaCode);
            });
        }
        else {
            return cb();
        }
        return undefined;
    }
    buyConfirm() {
        let message = 'Buy bitcoin for ' + this.amount + ' ' + this.currency;
        let okText = 'Confirm';
        let cancelText = 'Cancel';
        this.popupProvider
            .ionicConfirm(null, message, okText, cancelText)
            .then(ok => {
            if (!ok) {
                if (this.isCordova)
                    this.slideButton.isConfirmed(false);
                return;
            }
            this.onGoingProcessProvider.set('buyingBitcoin');
            this.glideraProvider.get2faCode(this.token, (err, tfa) => {
                if (err) {
                    this.onGoingProcessProvider.clear();
                    this.showError(err);
                    return;
                }
                this.ask2FaCode(tfa.mode, twoFaCode => {
                    if (tfa.mode != 'NONE' && _.isEmpty(twoFaCode)) {
                        this.onGoingProcessProvider.clear();
                        this.showError('No code entered');
                        return;
                    }
                    this.walletProvider
                        .getAddress(this.wallet, false)
                        .then(walletAddr => {
                        let data = {
                            destinationAddress: walletAddr,
                            qty: this.buyInfo.qty,
                            priceUuid: this.buyInfo.priceUuid,
                            useCurrentPrice: false,
                            ip: null
                        };
                        this.glideraProvider.buy(this.token, twoFaCode, data, (err, data) => {
                            this.onGoingProcessProvider.clear();
                            if (err)
                                return this.showError(err);
                            this.logger.info('Glidera Buy Info: ', JSON.stringify(data));
                            this.openFinishModal();
                        });
                    })
                        .catch(() => {
                        this.onGoingProcessProvider.clear();
                        this.showError(err);
                    });
                });
            });
        });
    }
    showWallets() {
        this.isOpenSelector = true;
        let id = this.wallet ? this.wallet.credentials.walletId : null;
        this.events.publish('showWalletsSelectorEvent', this.wallets, id, 'Receive in');
        this.events.subscribe('selectWalletEvent', wallet => {
            if (!_.isEmpty(wallet))
                this.onWalletSelect(wallet);
            this.events.unsubscribe('selectWalletEvent');
            this.isOpenSelector = false;
        });
    }
    onWalletSelect(wallet) {
        this.wallet = wallet;
        let parsedAmount = this.txFormatProvider.parseAmount(this.coin, this.amount, this.currency);
        this.amount = parsedAmount.amount;
        this.currency = parsedAmount.currency;
        this.amountUnitStr = parsedAmount.amountUnitStr;
        this.processPaymentInfo();
    }
    openFinishModal() {
        let finishText = 'Bought';
        let finishComment = 'A transfer has been initiated from your bank account. Your bitcoins should arrive to your wallet in 2-4 business day';
        let modal = this.modalCtrl.create(FinishModalPage, { finishText, finishComment }, { showBackdrop: true, enableBackdropDismiss: false });
        modal.present();
        modal.onDidDismiss(() => __awaiter(this, void 0, void 0, function* () {
            yield this.navCtrl.popToRoot({ animate: false });
            yield this.navCtrl.parent.select(0);
            yield this.navCtrl.push(GlideraPage, null, { animate: false });
        }));
    }
};
__decorate([
    ViewChild('slideButton'),
    __metadata("design:type", Object)
], BuyGlideraPage.prototype, "slideButton", void 0);
BuyGlideraPage = __decorate([
    Component({
        selector: 'page-buy-glidera',
        templateUrl: 'buy-glidera.html'
    }),
    __metadata("design:paramtypes", [PlatformProvider,
        Events,
        Logger,
        PopupProvider,
        NavController,
        NavParams,
        OnGoingProcessProvider,
        GlideraProvider,
        ProfileProvider,
        TxFormatProvider,
        WalletProvider,
        ModalController])
], BuyGlideraPage);
export { BuyGlideraPage };
//# sourceMappingURL=buy-glidera.js.map