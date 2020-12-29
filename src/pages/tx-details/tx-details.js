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
import { Events, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from '../../providers/logger/logger';
// Providers
import { AddressBookProvider } from '../../providers/address-book/address-book';
import { ConfigProvider } from '../../providers/config/config';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { OnGoingProcessProvider } from '../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../providers/popup/popup';
import { ProfileProvider } from '../../providers/profile/profile';
import { TxConfirmNotificationProvider } from '../../providers/tx-confirm-notification/tx-confirm-notification';
import { TxFormatProvider } from '../../providers/tx-format/tx-format';
import { WalletProvider } from '../../providers/wallet/wallet';
let TxDetailsPage = class TxDetailsPage {
    constructor(addressBookProvider, configProvider, events, externalLinkProvider, logger, navCtrl, navParams, onGoingProcess, popupProvider, profileProvider, txConfirmNotificationProvider, txFormatProvider, walletProvider, translate) {
        this.addressBookProvider = addressBookProvider;
        this.configProvider = configProvider;
        this.events = events;
        this.externalLinkProvider = externalLinkProvider;
        this.logger = logger;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.onGoingProcess = onGoingProcess;
        this.popupProvider = popupProvider;
        this.profileProvider = profileProvider;
        this.txConfirmNotificationProvider = txConfirmNotificationProvider;
        this.txFormatProvider = txFormatProvider;
        this.walletProvider = walletProvider;
        this.translate = translate;
        this.updateTxDebounced = _.debounce(this.updateTx, 1000);
        this.config = this.configProvider.get();
        this.txId = this.navParams.data.txid;
        this.title = this.translate.instant('Transaction');
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.color = this.wallet.color;
        this.copayerId = this.wallet.credentials.copayerId;
        this.isShared = this.wallet.credentials.n > 1;
        this.txsUnsubscribedForNotifications = this.config.confirmedTxsNotifications
            ? !this.config.confirmedTxsNotifications.enabled
            : true;
        let defaults = this.configProvider.getDefaults();
        this.blockexplorerUrl =
            this.wallet.coin === 'bch'
                ? defaults.blockExplorerUrl.bch
                : defaults.blockExplorerUrl.btc;
        this.txConfirmNotificationProvider.checkIfEnabled(this.txId).then(res => {
            this.txNotification = {
                value: res
            };
        });
        this.updateTx();
    }
    ionViewWillEnter() {
        this.events.subscribe('bwsEvent', (_, type, n) => {
            if (type == 'NewBlock' && n && n.data && n.data.network == 'livenet')
                this.updateTxDebounced({ hideLoading: true });
        });
    }
    ionViewWillLeave() {
        this.events.unsubscribe('bwsEvent');
    }
    readMore() {
        let url = 'https://getcoins.com/faq';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('Read more in our support page');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    updateMemo() {
        this.walletProvider
            .getTxNote(this.wallet, this.btx.txid)
            .then(note => {
            if (!note || note.body == '')
                return;
            this.btx.note = note;
        })
            .catch(err => {
            this.logger.warn('Could not fetch transaction note: ' + err);
            return;
        });
    }
    initActionList() {
        this.actionList = [];
        if ((this.btx.action != 'sent' && this.btx.action != 'moved') ||
            !this.isShared)
            return;
        let actionDescriptions = {
            created: this.translate.instant('Proposal Created'),
            accept: this.translate.instant('Accepted'),
            reject: this.translate.instant('Rejected'),
            broadcasted: this.translate.instant('Broadcasted')
        };
        this.actionList.push({
            type: 'created',
            time: this.btx.createdOn,
            description: actionDescriptions.created,
            by: this.btx.creatorName
        });
        _.each(this.btx.actions, action => {
            this.actionList.push({
                type: action.type,
                time: action.createdOn,
                description: actionDescriptions[action.type],
                by: action.copayerName
            });
        });
        this.actionList.push({
            type: 'broadcasted',
            time: this.btx.time,
            description: actionDescriptions.broadcasted
        });
        setTimeout(() => {
            this.actionList.reverse();
        }, 10);
    }
    updateTx(opts) {
        opts = opts ? opts : {};
        if (!opts.hideLoading)
            this.onGoingProcess.set('loadingTxInfo');
        this.walletProvider
            .getTx(this.wallet, this.txId)
            .then(tx => {
            if (!opts.hideLoading)
                this.onGoingProcess.clear();
            this.btx = this.txFormatProvider.processTx(this.wallet.coin, tx, this.walletProvider.useLegacyAddress());
            this.btx.feeFiatStr = this.txFormatProvider.formatAlternativeStr(this.wallet.coin, tx.fees);
            this.btx.feeRateStr =
                ((this.btx.fees / (this.btx.amount + this.btx.fees)) * 100).toFixed(2) + '%';
            if (this.btx.action != 'invalid') {
                if (this.btx.action == 'sent')
                    this.title = this.translate.instant('Sent Funds');
                if (this.btx.action == 'received')
                    this.title = this.translate.instant('Received Funds');
                if (this.btx.action == 'moved')
                    this.title = this.translate.instant('Moved Funds');
            }
            this.updateMemo();
            this.initActionList();
            this.contact();
            this.walletProvider
                .getLowAmount(this.wallet)
                .then((amount) => {
                this.btx.lowAmount = tx.amount < amount;
            })
                .catch(err => {
                this.logger.warn('Error getting low amounts: ' + err);
                return;
            });
        })
            .catch(err => {
            if (!opts.hideLoading)
                this.onGoingProcess.clear();
            this.logger.warn('Error getting transaction: ' + err);
            this.navCtrl.pop();
            return this.popupProvider.ionicAlert('Error', this.translate.instant('Transaction not available at this time'));
        });
    }
    showCommentPopup() {
        let opts = {};
        if (this.btx.message) {
            opts.defaultText = this.btx.message;
        }
        if (this.btx.note && this.btx.note.body)
            opts.defaultText = this.btx.note.body;
        this.popupProvider
            .ionicPrompt(this.wallet.name, this.translate.instant('Memo'), opts)
            .then((text) => {
            if (text == null)
                return;
            this.btx.note = {
                body: text
            };
            this.logger.debug('Saving memo');
            let args = {
                txid: this.btx.txid,
                body: text
            };
            this.walletProvider
                .editTxNote(this.wallet, args)
                .then(() => {
                this.logger.info('Tx Note edited');
            })
                .catch(err => {
                this.logger.debug('Could not save tx comment ' + err);
            });
        });
    }
    viewOnBlockchain() {
        let btx = this.btx;
        let url = 'https://' +
            (this.getShortNetworkName() == 'test' ? 'test-' : '') +
            this.blockexplorerUrl +
            '/tx/' +
            btx.txid;
        let optIn = true;
        let title = null;
        let message = this.translate.instant('View Transaction on Insight');
        let okText = this.translate.instant('Open Insight');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    getShortNetworkName() {
        let n = this.wallet.credentials.network;
        return n.substring(0, 4);
    }
    txConfirmNotificationChange() {
        if (this.txNotification.value) {
            this.txConfirmNotificationProvider.subscribe(this.wallet, {
                txid: this.txId
            });
        }
        else {
            this.txConfirmNotificationProvider.unsubscribe(this.wallet, this.txId);
        }
    }
    contact() {
        let addr = this.btx.addressTo;
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
TxDetailsPage = __decorate([
    Component({
        selector: 'page-tx-details',
        templateUrl: 'tx-details.html'
    }),
    __metadata("design:paramtypes", [AddressBookProvider,
        ConfigProvider,
        Events,
        ExternalLinkProvider,
        Logger,
        NavController,
        NavParams,
        OnGoingProcessProvider,
        PopupProvider,
        ProfileProvider,
        TxConfirmNotificationProvider,
        TxFormatProvider,
        WalletProvider,
        TranslateService])
], TxDetailsPage);
export { TxDetailsPage };
//# sourceMappingURL=tx-details.js.map