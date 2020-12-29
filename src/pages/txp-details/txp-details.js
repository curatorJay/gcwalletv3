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
import { Events, ModalController, NavParams, ViewController } from 'ionic-angular';
import { Logger } from '../../providers/logger/logger';
// providers
import { AddressBookProvider } from '../../providers/address-book/address-book';
import { BwcErrorProvider } from '../../providers/bwc-error/bwc-error';
import { ConfigProvider } from '../../providers/config/config';
import { FeeProvider } from '../../providers/fee/fee';
import { OnGoingProcessProvider } from '../../providers/on-going-process/on-going-process';
import { PlatformProvider } from '../../providers/platform/platform';
import { PopupProvider } from '../../providers/popup/popup';
import { ProfileProvider } from '../../providers/profile/profile';
import { TxFormatProvider } from '../../providers/tx-format/tx-format';
import { WalletProvider } from '../../providers/wallet/wallet';
// pages
import { FinishModalPage } from '../finish/finish';
import * as _ from 'lodash';
let TxpDetailsPage = class TxpDetailsPage {
    constructor(navParams, platformProvider, feeProvider, events, logger, popupProvider, bwcError, walletProvider, onGoingProcessProvider, viewCtrl, configProvider, profileProvider, txFormatProvider, translate, modalCtrl, addressBookProvider) {
        this.navParams = navParams;
        this.platformProvider = platformProvider;
        this.feeProvider = feeProvider;
        this.events = events;
        this.logger = logger;
        this.popupProvider = popupProvider;
        this.bwcError = bwcError;
        this.walletProvider = walletProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.viewCtrl = viewCtrl;
        this.configProvider = configProvider;
        this.profileProvider = profileProvider;
        this.txFormatProvider = txFormatProvider;
        this.translate = translate;
        this.modalCtrl = modalCtrl;
        this.addressBookProvider = addressBookProvider;
        this.showMultiplesOutputs = false;
        let config = this.configProvider.get().wallet;
        this.tx = this.navParams.data.tx;
        this.wallet = this.tx.wallet
            ? this.tx.wallet
            : this.profileProvider.getWallet(this.tx.walletId);
        this.tx = this.txFormatProvider.processTx(this.wallet.coin, this.tx, this.walletProvider.useLegacyAddress());
        if (!this.tx.toAddress)
            this.tx.toAddress = this.tx.outputs[0].toAddress;
        this.isGlidera = this.navParams.data.isGlidera;
        this.GLIDERA_LOCK_TIME = 6 * 60 * 60;
        this.currentSpendUnconfirmed = config.spendUnconfirmed;
        this.loading = false;
        this.isCordova = this.platformProvider.isCordova;
        this.copayers = this.wallet.status.wallet.copayers;
        this.copayerId = this.wallet.credentials.copayerId;
        this.isShared = this.wallet.credentials.n > 1;
        this.canSign = this.wallet.canSign() || this.wallet.isPrivKeyExternal();
        this.color = this.wallet.color;
        this.contact();
        // To test multiple outputs...
        // var txp = {
        //   message: 'test multi-output',
        //   fee: 1000,
        //   createdOn: Math.floor(Date.now() / 1000),
        //   outputs: [],
        // };
        // for (let i = 0; i < 15; i++) {
        //   txp.outputs.push({
        //     amountStr: "600 BTC",
        //     toAddress: '2N8bhEwbKtMvR2jqMRcTCQqzHP6zXGToXcK',
        //     message: 'output #' + (Number(i) + 1)
        //   });
        // };
        // this.tx = _.merge(this.tx, txp);
        // this.tx.hasMultiplesOutputs = true;
    }
    ionViewWillEnter() {
        this.displayFeeValues();
        this.initActionList();
        this.checkPaypro();
        this.applyButtonText();
        // ToDo: use tx.customData instead of tx.message
        if (this.tx.message === 'Glidera transaction' && this.isGlidera) {
            this.tx.isGlidera = true;
            if (this.tx.canBeRemoved) {
                this.tx.canBeRemoved =
                    Date.now() / 1000 - (this.tx.ts || this.tx.createdOn) >
                        this.GLIDERA_LOCK_TIME;
            }
        }
        this.events.subscribe('bwsEvent', (walletId, type) => {
            _.each([
                'TxProposalRejectedBy',
                'TxProposalAcceptedBy',
                'transactionProposalRemoved',
                'TxProposalRemoved',
                'NewOutgoingTx',
                'UpdateTx'
            ], (eventName) => {
                if (walletId == this.wallet.id && type == eventName) {
                    this.updateTxInfo(eventName);
                }
            });
        });
    }
    ionViewWillLeave() {
        this.events.unsubscribe('bwsEvent');
    }
    displayFeeValues() {
        this.tx.feeFiatStr = this.txFormatProvider.formatAlternativeStr(this.wallet.coin, this.tx.fee);
        this.tx.feeRateStr =
            ((this.tx.fee / (this.tx.amount + this.tx.fee)) * 100).toFixed(2) + '%';
        const feeOpts = this.feeProvider.getFeeOpts();
        this.tx.feeLevelStr = feeOpts[this.tx.feeLevel];
    }
    applyButtonText() {
        var lastSigner = _.filter(this.tx.actions, {
            type: 'accept'
        }).length ==
            this.tx.requiredSignatures - 1;
        if (lastSigner) {
            this.buttonText = this.isCordova
                ? this.translate.instant('Slide to send')
                : this.translate.instant('Click to send');
            this.successText = this.translate.instant('Payment Sent');
        }
        else {
            this.buttonText = this.isCordova
                ? this.translate.instant('Slide to accept')
                : this.translate.instant('Click to accept');
            this.successText = this.translate.instant('Payment Accepted');
        }
    }
    initActionList() {
        this.actionList = [];
        if (!this.isShared)
            return;
        var actionDescriptions = {
            created: this.translate.instant('Proposal Created'),
            accept: this.translate.instant('Accepted'),
            reject: this.translate.instant('Rejected'),
            broadcasted: this.translate.instant('Broadcasted')
        };
        this.actionList.push({
            type: 'created',
            time: this.tx.createdOn,
            description: actionDescriptions['created'],
            by: this.tx.creatorName
        });
        _.each(this.tx.actions, action => {
            this.actionList.push({
                type: action.type,
                time: action.createdOn,
                description: actionDescriptions[action.type],
                by: action.copayerName
            });
        });
        setTimeout(() => {
            this.actionList.reverse();
        }, 10);
    }
    checkPaypro() {
        if (this.tx.payProUrl) {
            this.wallet.fetchPayPro({
                payProUrl: this.tx.payProUrl
            }, (err, paypro) => {
                if (err) {
                    this.logger.error(err);
                    this.paymentExpired = true;
                    this.popupProvider.ionicAlert(null, this.translate.instant('Could not fetch the invoice'));
                    return;
                }
                this.tx.paypro = paypro;
                this.paymentTimeControl(this.tx.paypro.expires);
            });
        }
    }
    paymentTimeControl(expirationTime) {
        let setExpirationTime = () => {
            let now = Math.floor(Date.now() / 1000);
            if (now > expirationTime) {
                this.paymentExpired = true;
                if (this.countDown)
                    clearInterval(this.countDown);
                return;
            }
            let totalSecs = expirationTime - now;
            let m = Math.floor(totalSecs / 60);
            let s = totalSecs % 60;
            this.expires = ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
        };
        this.paymentExpired = false;
        setExpirationTime();
        this.countDown = setInterval(() => {
            setExpirationTime();
        }, 1000);
    }
    setError(err, prefix) {
        this.loading = false;
        this.popupProvider.ionicAlert(this.translate.instant('Error'), this.bwcError.msg(err, prefix));
    }
    sign() {
        this.loading = true;
        this.walletProvider
            .publishAndSign(this.wallet, this.tx)
            .then(() => {
            this.onGoingProcessProvider.clear();
            this.openFinishModal();
        })
            .catch(err => {
            this.onGoingProcessProvider.clear();
            this.setError(err, 'Could not send payment');
        });
    }
    reject() {
        let title = this.translate.instant('Warning!');
        let msg = this.translate.instant('Are you sure you want to reject this transaction?');
        this.popupProvider
            .ionicConfirm(title, msg, null, null)
            .then((res) => {
            if (!res)
                return;
            this.loading = true;
            this.onGoingProcessProvider.set('rejectTx');
            this.walletProvider
                .reject(this.wallet, this.tx)
                .then(() => {
                this.onGoingProcessProvider.clear();
                this.close();
            })
                .catch(err => {
                this.onGoingProcessProvider.clear();
                this.setError(err, this.translate.instant('Could not reject payment'));
            });
        });
    }
    remove() {
        let title = this.translate.instant('Warning!');
        let msg = this.translate.instant('Are you sure you want to remove this transaction?');
        this.popupProvider
            .ionicConfirm(title, msg, null, null)
            .then((res) => {
            if (!res)
                return;
            this.onGoingProcessProvider.set('removeTx');
            this.walletProvider
                .removeTx(this.wallet, this.tx)
                .then(() => {
                this.onGoingProcessProvider.clear();
                this.close();
            })
                .catch(err => {
                this.onGoingProcessProvider.clear();
                if (err && !(err.message && err.message.match(/Unexpected/))) {
                    this.setError(err, this.translate.instant('Could not delete payment proposal'));
                }
            });
        });
    }
    broadcast() {
        this.loading = true;
        this.onGoingProcessProvider.set('broadcastingTx');
        this.walletProvider
            .broadcastTx(this.wallet, this.tx)
            .then(() => {
            this.onGoingProcessProvider.clear();
            this.openFinishModal();
        })
            .catch(err => {
            this.onGoingProcessProvider.clear();
            this.setError(err, 'Could not broadcast payment');
            this.logger.error('Could not broadcast: ', this.tx.coin, this.tx.network, this.tx.raw);
        });
    }
    getShortNetworkName() {
        return this.wallet.credentials.networkName.substring(0, 4);
    }
    updateTxInfo(eventName) {
        this.walletProvider
            .getTxp(this.wallet, this.tx.id)
            .then(tx => {
            let action = _.find(tx.actions, {
                copayerId: this.wallet.credentials.copayerId
            });
            this.tx = this.txFormatProvider.processTx(this.wallet.coin, tx, this.walletProvider.useLegacyAddress());
            if (!action && tx.status == 'pending')
                this.tx.pendingForUs = true;
            this.updateCopayerList();
            this.initActionList();
        })
            .catch(err => {
            if (err.message &&
                err.message == 'Transaction proposal not found' &&
                (eventName == 'transactionProposalRemoved' ||
                    eventName == 'TxProposalRemoved')) {
                this.tx.removed = true;
                this.tx.canBeRemoved = false;
                this.tx.pendingForUs = false;
            }
        });
    }
    updateCopayerList() {
        _.map(this.copayers, (cp) => {
            _.each(this.tx.actions, ac => {
                if (cp.id == ac.copayerId) {
                    cp.action = ac.type;
                }
            });
        });
    }
    onConfirm() {
        this.sign();
    }
    close() {
        this.loading = false;
        this.viewCtrl.dismiss();
    }
    openFinishModal() {
        let modal = this.modalCtrl.create(FinishModalPage, { finishText: this.successText }, { showBackdrop: true, enableBackdropDismiss: false });
        modal.present();
        modal.onDidDismiss(() => {
            this.close();
        });
    }
    contact() {
        let addr = this.tx.toAddress;
        this.addressBookProvider
            .get(addr)
            .then(ab => {
            if (ab) {
                let name = _.isObject(ab) ? ab.name : ab;
                this.contactName = name;
            }
        })
            .catch(err => {
            this.logger.warn(err);
        });
    }
};
TxpDetailsPage = __decorate([
    Component({
        selector: 'page-txp-details',
        templateUrl: 'txp-details.html'
    }),
    __metadata("design:paramtypes", [NavParams,
        PlatformProvider,
        FeeProvider,
        Events,
        Logger,
        PopupProvider,
        BwcErrorProvider,
        WalletProvider,
        OnGoingProcessProvider,
        ViewController,
        ConfigProvider,
        ProfileProvider,
        TxFormatProvider,
        TranslateService,
        ModalController,
        AddressBookProvider])
], TxpDetailsPage);
export { TxpDetailsPage };
//# sourceMappingURL=txp-details.js.map