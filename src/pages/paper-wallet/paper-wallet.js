var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Events, ModalController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
// pages
import { FinishModalPage } from '../finish/finish';
// providers
import { BwcErrorProvider } from '../../providers/bwc-error/bwc-error';
import { BwcProvider } from '../../providers/bwc/bwc';
import { FeeProvider } from '../../providers/fee/fee';
import { Logger } from '../../providers/logger/logger';
import { OnGoingProcessProvider } from '../../providers/on-going-process/on-going-process';
import { PlatformProvider } from '../../providers/platform/platform';
import { PopupProvider } from '../../providers/popup/popup';
import { ProfileProvider } from '../../providers/profile/profile';
import { WalletProvider } from '../../providers/wallet/wallet';
let PaperWalletPage = class PaperWalletPage {
    constructor(navCtrl, navParams, bwcProvider, onGoingProcessProvider, popupProvider, logger, walletProvider, feeProvider, profileProvider, events, modalCtrl, translate, platformProvider, bwcErrorProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.bwcProvider = bwcProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.popupProvider = popupProvider;
        this.logger = logger;
        this.walletProvider = walletProvider;
        this.feeProvider = feeProvider;
        this.profileProvider = profileProvider;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.translate = translate;
        this.platformProvider = platformProvider;
        this.bwcErrorProvider = bwcErrorProvider;
        this.balances = [];
        this.bitcore = this.bwcProvider.getBitcore();
        this.isCordova = this.platformProvider.isCordova;
        this.isOpenSelector = false;
        this.scannedKey = this.navParams.data.privateKey;
        this.isPkEncrypted = this.scannedKey
            ? this.scannedKey.substring(0, 2) == '6P'
            : null;
        this.error = false;
        this.wallets = this.profileProvider.getWallets({
            onlyComplete: true,
            network: 'livenet'
        });
        this.wallets = _.filter(_.clone(this.wallets), wallet => {
            return !wallet.needsBackup;
        });
        this.coins = _.uniq(_.map(this.wallets, (wallet) => wallet.coin));
    }
    ionViewWillLeave() {
        this.navCtrl.swipeBackEnabled = true;
    }
    ionViewWillEnter() {
        this.navCtrl.swipeBackEnabled = false;
    }
    ionViewDidEnter() {
        if (!this.wallets || !this.wallets.length) {
            this.noMatchingWallet = true;
            return;
        }
        this.wallet = this.wallets[0];
        if (!this.wallet)
            return;
        if (!this.isPkEncrypted)
            this.scanFunds();
        else {
            let message = this.translate.instant('Private key encrypted. Enter password');
            let opts = {
                type: 'password',
                enableBackdropDismiss: false
            };
            this.popupProvider.ionicPrompt(null, message, opts).then(res => {
                this.passphrase = res;
                setTimeout(() => {
                    this.scanFunds();
                }, 200);
            });
        }
    }
    getPrivateKey(scannedKey, privateKeyIsEncrypted, passphrase, cb) {
        if (!privateKeyIsEncrypted) {
            return cb(null, scannedKey);
        }
        this.wallet.decryptBIP38PrivateKey(scannedKey, passphrase, null, cb);
    }
    getBalance(privateKey, coin, cb) {
        this.wallet.getBalanceFromPrivateKey(privateKey, coin, cb);
    }
    checkPrivateKey(privateKey) {
        try {
            new this.bitcore.PrivateKey(privateKey, 'livenet');
        }
        catch (err) {
            return false;
        }
        return true;
    }
    _scanFunds(coin) {
        return new Promise((resolve, reject) => {
            this.getPrivateKey(this.scannedKey, this.isPkEncrypted, this.passphrase, (err, privateKey) => {
                if (err)
                    return reject(err);
                if (!this.checkPrivateKey(privateKey))
                    return reject(new Error('Invalid private key'));
                this.getBalance(privateKey, coin, (err, balance) => {
                    if (err)
                        return reject(err);
                    return resolve({ privateKey, coin, balance });
                });
            });
        });
    }
    scanFunds() {
        this.onGoingProcessProvider.set('scanning');
        let scans = _.map(this.coins, (coin) => this._scanFunds(coin));
        Promise.all(scans)
            .then(data => {
            this.onGoingProcessProvider.clear();
            _.each(data, d => {
                this.balances.push(d);
            });
            let available = {};
            this.balances = _.filter(_.clone(this.balances), b => {
                let nonzero = b.balance > 0;
                available[b.coin] = nonzero;
                return nonzero;
            });
            this.wallets = _.filter(_.clone(this.wallets), w => available[w.coin]);
            this.wallet = this.wallets[0];
            if (this.balances.length == 0) {
                this.popupProvider.ionicAlert('Error', this.translate.instant('No funds found'));
                this.navCtrl.pop();
            }
        })
            .catch(err => {
            this.onGoingProcessProvider.clear();
            this.logger.error(err);
            this.popupProvider.ionicAlert(this.translate.instant('Error scanning funds:'), this.bwcErrorProvider.msg(err));
            this.navCtrl.pop();
        });
    }
    _sweepWallet() {
        return new Promise((resolve, reject) => {
            let balanceToSweep = _.filter(this.balances, b => {
                return b.coin === this.wallet.coin;
            })[0];
            this.walletProvider
                .getAddress(this.wallet, true)
                .then((destinationAddress) => {
                let opts = {};
                opts.coin = balanceToSweep.coin;
                this.wallet.buildTxFromPrivateKey(balanceToSweep.privateKey, destinationAddress, opts, (err, testTx) => {
                    if (err)
                        return reject(err);
                    let rawTxLength = testTx.serialize().length;
                    this.feeProvider
                        .getCurrentFeeRate(balanceToSweep.coin, 'livenet')
                        .then((feePerKb) => {
                        opts.fee = Math.round((feePerKb * rawTxLength) / 2000);
                        this.wallet.buildTxFromPrivateKey(balanceToSweep.privateKey, destinationAddress, opts, (err, tx) => {
                            if (err)
                                return reject(err);
                            this.wallet.broadcastRawTx({
                                rawTx: tx.serialize(),
                                network: 'livenet',
                                coin: balanceToSweep.coin
                            }, (err, txid) => {
                                if (err)
                                    return reject(err);
                                return resolve({ destinationAddress, txid });
                            });
                        });
                    });
                });
            })
                .catch(err => {
                return reject(err);
            });
        });
    }
    sweepWallet() {
        this.onGoingProcessProvider.set('sweepingWallet');
        this._sweepWallet()
            .then(data => {
            this.onGoingProcessProvider.clear();
            this.logger.debug('Success sweep. Destination address:' +
                data.destinationAddress +
                ' - transaction id: ' +
                data.txid);
            this.openFinishModal();
        })
            .catch(err => {
            this.onGoingProcessProvider.clear();
            this.logger.error(err);
            this.popupProvider.ionicAlert(this.translate.instant('Error sweeping wallet:'), this.bwcErrorProvider.msg(err));
        });
    }
    onWalletSelect(wallet) {
        this.wallet = wallet;
    }
    showWallets() {
        this.isOpenSelector = true;
        let id = this.wallet ? this.wallet.credentials.walletId : null;
        this.events.publish('showWalletsSelectorEvent', this.wallets, id, 'Transfer to');
        this.events.subscribe('selectWalletEvent', wallet => {
            if (!_.isEmpty(wallet))
                this.onWalletSelect(wallet);
            this.events.unsubscribe('selectWalletEvent');
            this.isOpenSelector = false;
        });
    }
    openFinishModal() {
        let finishComment = this.translate.instant('Check the transaction on your wallet details');
        let finishText = this.translate.instant('Sweep Completed');
        let modal = this.modalCtrl.create(FinishModalPage, { finishText, finishComment }, { showBackdrop: true, enableBackdropDismiss: false });
        modal.present();
        modal.onDidDismiss(() => {
            this.navCtrl.pop();
        });
    }
};
__decorate([
    ViewChild('slideButton'),
    __metadata("design:type", Object)
], PaperWalletPage.prototype, "slideButton", void 0);
PaperWalletPage = __decorate([
    Component({
        selector: 'page-paper-wallet',
        templateUrl: 'paper-wallet.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        BwcProvider,
        OnGoingProcessProvider,
        PopupProvider,
        Logger,
        WalletProvider,
        FeeProvider,
        ProfileProvider,
        Events,
        ModalController,
        TranslateService,
        PlatformProvider,
        BwcErrorProvider])
], PaperWalletPage);
export { PaperWalletPage };
//# sourceMappingURL=paper-wallet.js.map