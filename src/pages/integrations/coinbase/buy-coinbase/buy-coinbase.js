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
import * as _ from 'lodash';
import { Logger } from '../../../../providers/logger/logger';
// providers
import { CoinbaseProvider } from '../../../../providers/coinbase/coinbase';
import { ExternalLinkProvider } from '../../../../providers/external-link/external-link';
import { OnGoingProcessProvider } from '../../../../providers/on-going-process/on-going-process';
import { PlatformProvider } from '../../../../providers/platform/platform';
import { PopupProvider } from '../../../../providers/popup/popup';
import { ProfileProvider } from '../../../../providers/profile/profile';
import { TxFormatProvider } from '../../../../providers/tx-format/tx-format';
import { WalletProvider } from '../../../../providers/wallet/wallet';
// pages
import { FinishModalPage } from '../../../finish/finish';
import { CoinbasePage } from '../coinbase';
let BuyCoinbasePage = class BuyCoinbasePage {
    constructor(coinbaseProvider, logger, popupProvider, navCtrl, events, externalLinkProvider, onGoingProcessProvider, navParams, walletProvider, txFormatProvider, profileProvider, modalCtrl, platformProvider) {
        this.coinbaseProvider = coinbaseProvider;
        this.logger = logger;
        this.popupProvider = popupProvider;
        this.navCtrl = navCtrl;
        this.events = events;
        this.externalLinkProvider = externalLinkProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.navParams = navParams;
        this.walletProvider = walletProvider;
        this.txFormatProvider = txFormatProvider;
        this.profileProvider = profileProvider;
        this.modalCtrl = modalCtrl;
        this.platformProvider = platformProvider;
        this.coin = 'btc';
        this.isFiat = this.navParams.data.currency != 'BTC' ? true : false;
        this.amount = this.navParams.data.amount;
        this.currency = this.navParams.data.currency;
        this.network = this.coinbaseProvider.getNetwork();
        this.isCordova = this.platformProvider.isCordova;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad BuyCoinbasePage');
    }
    ionViewWillLeave() {
        this.navCtrl.swipeBackEnabled = true;
    }
    ionViewWillEnter() {
        this.isOpenSelector = false;
        this.navCtrl.swipeBackEnabled = false;
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
        err = err.errors ? err.errors[0].message : err;
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
        this.onGoingProcessProvider.set('connectingCoinbase');
        this.coinbaseProvider.init((err, res) => {
            if (err) {
                this.onGoingProcessProvider.clear();
                this.showErrorAndBack(err);
                return;
            }
            let accessToken = res.accessToken;
            this.coinbaseProvider.buyPrice(accessToken, this.coinbaseProvider.getAvailableCurrency(), (err, b) => {
                if (err)
                    this.logger.error(err);
                this.buyPrice = b.data || null;
            });
            this.paymentMethods = [];
            this.selectedPaymentMethodId = null;
            this.coinbaseProvider.getPaymentMethods(accessToken, (err, p) => {
                if (err) {
                    this.onGoingProcessProvider.clear();
                    this.showErrorAndBack(err);
                    return;
                }
                let hasPrimary;
                let pm;
                for (let i = 0; i < p.data.length; i++) {
                    pm = p.data[i];
                    if (pm.allow_buy) {
                        this.paymentMethods.push(pm);
                    }
                    if (pm.allow_buy && pm.primary_buy) {
                        hasPrimary = true;
                        this.selectedPaymentMethodId = pm.id;
                    }
                }
                if (_.isEmpty(this.paymentMethods)) {
                    this.onGoingProcessProvider.clear();
                    let url = 'https://support.coinbase.com/customer/portal/articles/1148716-payment-methods-for-us-customers';
                    let msg = 'No payment method available to buy';
                    let okText = 'More info';
                    let cancelText = 'Go Back';
                    this.popupProvider
                        .ionicConfirm(null, msg, okText, cancelText)
                        .then(res => {
                        if (res)
                            this.externalLinkProvider.open(url);
                        this.navCtrl.remove(3, 1);
                        this.navCtrl.pop();
                    });
                    return;
                }
                if (!hasPrimary)
                    this.selectedPaymentMethodId = this.paymentMethods[0].id;
                this.buyRequest();
            });
        });
    }
    buyRequest() {
        this.coinbaseProvider.init((err, res) => {
            if (err) {
                this.onGoingProcessProvider.clear();
                this.showErrorAndBack(err);
                return;
            }
            let accessToken = res.accessToken;
            let accountId = res.accountId;
            let dataSrc = {
                amount: this.amount,
                currency: this.currency,
                payment_method: this.selectedPaymentMethodId,
                quote: true
            };
            this.coinbaseProvider.buyRequest(accessToken, accountId, dataSrc, (err, data) => {
                this.onGoingProcessProvider.clear();
                if (err) {
                    this.showErrorAndBack(err);
                    return;
                }
                this.buyRequestInfo = data.data;
            });
        });
    }
    buyConfirm() {
        let message = 'Buy bitcoin for ' + this.amountUnitStr;
        let okText = 'Confirm';
        let cancelText = 'Cancel';
        this.popupProvider
            .ionicConfirm(null, message, okText, cancelText)
            .then((ok) => {
            if (!ok) {
                if (this.isCordova)
                    this.slideButton.isConfirmed(false);
                return;
            }
            this.onGoingProcessProvider.set('buyingBitcoin');
            this.coinbaseProvider.init((err, res) => {
                if (err) {
                    this.onGoingProcessProvider.clear();
                    this.showError(this.coinbaseProvider.getErrorsAsString(err));
                    return;
                }
                let accessToken = res.accessToken;
                let accountId = res.accountId;
                let dataSrc = {
                    amount: this.amount,
                    currency: this.currency,
                    payment_method: this.selectedPaymentMethodId,
                    commit: true
                };
                this.coinbaseProvider.buyRequest(accessToken, accountId, dataSrc, (err, b) => {
                    if (err) {
                        this.onGoingProcessProvider.clear();
                        this.showError(this.coinbaseProvider.getErrorsAsString(err));
                        return;
                    }
                    setTimeout(() => {
                        let tx = b.data ? b.data.transaction : null;
                        if (tx && tx.id) {
                            this.processBuyTx(tx, accessToken, accountId);
                        }
                        else {
                            this._processBuyOrder(b, accessToken, accountId);
                        }
                    }, 10000);
                });
            });
        });
    }
    processBuyTx(tx, accessToken, accountId) {
        if (!tx) {
            this.onGoingProcessProvider.clear();
            this.showError('Transaction not found');
            return;
        }
        this.coinbaseProvider.getTransaction(accessToken, accountId, tx.id, (err, updatedTx) => {
            if (err) {
                this.onGoingProcessProvider.clear();
                this.showError(this.coinbaseProvider.getErrorsAsString(err));
                return;
            }
            this.walletProvider
                .getAddress(this.wallet, false)
                .then((walletAddr) => {
                updatedTx.data['toAddr'] = walletAddr;
                updatedTx.data['status'] = 'pending'; // Forcing "pending" status to process later
                this.logger.debug('Saving transaction to process later...');
                this.coinbaseProvider.savePendingTransaction(updatedTx.data, {}, err => {
                    this.onGoingProcessProvider.clear();
                    if (err)
                        this.logger.debug(err);
                    this.openFinishModal();
                });
            })
                .catch(err => {
                this.onGoingProcessProvider.clear();
                this.showError(err);
            });
        });
    }
    _processBuyOrder(b, accessToken, accountId) {
        this.coinbaseProvider.getBuyOrder(accessToken, accountId, b.data.id, (err, buyResp) => {
            if (err) {
                this.onGoingProcessProvider.clear();
                this.showError(this.coinbaseProvider.getErrorsAsString(err));
                return;
            }
            let tx = buyResp.data ? buyResp.data.transaction : null;
            if (tx && tx.id) {
                this.processBuyTx(tx, accessToken, accountId);
            }
            else {
                setTimeout(() => {
                    this._processBuyOrder(b, accessToken, accountId);
                }, 10000);
            }
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
        // Buy always in BTC
        this.amount = (parsedAmount.amountSat / 100000000).toFixed(8);
        this.currency = 'BTC';
        this.amountUnitStr = parsedAmount.amountUnitStr;
        this.onGoingProcessProvider.set('calculatingFee');
        this.coinbaseProvider.checkEnoughFundsForFee(this.amount, err => {
            this.onGoingProcessProvider.clear();
            if (err) {
                this.showErrorAndBack(err);
                return;
            }
            this.processPaymentInfo();
        });
    }
    openFinishModal() {
        let finishText = 'Bought';
        let finishComment = 'Bitcoin purchase completed. Coinbase has queued the transfer to your selected wallet';
        let modal = this.modalCtrl.create(FinishModalPage, { finishText, finishComment }, { showBackdrop: true, enableBackdropDismiss: false });
        modal.present();
        modal.onDidDismiss(() => __awaiter(this, void 0, void 0, function* () {
            yield this.navCtrl.popToRoot({ animate: false });
            yield this.navCtrl.parent.select(0);
            yield this.navCtrl.push(CoinbasePage, { coin: 'btc' }, { animate: false });
        }));
    }
};
__decorate([
    ViewChild('slideButton'),
    __metadata("design:type", Object)
], BuyCoinbasePage.prototype, "slideButton", void 0);
BuyCoinbasePage = __decorate([
    Component({
        selector: 'page-buy-coinbase',
        templateUrl: 'buy-coinbase.html'
    }),
    __metadata("design:paramtypes", [CoinbaseProvider,
        Logger,
        PopupProvider,
        NavController,
        Events,
        ExternalLinkProvider,
        OnGoingProcessProvider,
        NavParams,
        WalletProvider,
        TxFormatProvider,
        ProfileProvider,
        ModalController,
        PlatformProvider])
], BuyCoinbasePage);
export { BuyCoinbasePage };
//# sourceMappingURL=buy-coinbase.js.map