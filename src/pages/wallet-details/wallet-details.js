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
import { Http } from '@angular/http';
import { Events, ModalController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
// providers
import { AddressBookProvider } from '../../providers/address-book/address-book';
import { BwcErrorProvider } from '../../providers/bwc-error/bwc-error';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { Logger } from '../../providers/logger/logger';
import { OnGoingProcessProvider } from '../../providers/on-going-process/on-going-process';
import { ProfileProvider } from '../../providers/profile/profile';
import { TimeProvider } from '../../providers/time/time';
import { WalletProvider } from '../../providers/wallet/wallet';
// pages
import { BackupWarningPage } from '../../pages/backup/backup-warning/backup-warning';
import { WalletAddressesPage } from '../../pages/settings/wallet-settings/wallet-settings-advanced/wallet-addresses/wallet-addresses';
import { TxDetailsPage } from '../../pages/tx-details/tx-details';
import { SearchTxModalPage } from './search-tx-modal/search-tx-modal';
import { WalletBalancePage } from './wallet-balance/wallet-balance';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
const HISTORY_SHOW_LIMIT = 10;
let WalletDetailsPage = class WalletDetailsPage {
    constructor(navCtrl, navParams, profileProvider, walletProvider, addressbookProvider, bwcError, events, logger, timeProvider, translate, modalCtrl, onGoingProcessProvider, externalLinkProvider, http) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.profileProvider = profileProvider;
        this.walletProvider = walletProvider;
        this.addressbookProvider = addressbookProvider;
        this.bwcError = bwcError;
        this.events = events;
        this.logger = logger;
        this.timeProvider = timeProvider;
        this.translate = translate;
        this.modalCtrl = modalCtrl;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.externalLinkProvider = externalLinkProvider;
        this.http = http;
        this.currentPage = 0;
        this.history = [];
        this.groupedHistory = [];
        this.updatingTxHistoryProgress = 0;
        this.showBalanceButton = false;
        this.addressbook = {};
        this.txps = [];
        this.updateAll = _.debounce((force) => {
            this.updateStatus(force);
            this.updateTxHistory();
        }, 2000, {
            leading: true
        });
        let clearCache = this.navParams.data.clearCache;
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.getCurrentbtcPrice();
        // Getting info from cache
        if (clearCache) {
            this.clearHistoryCache();
        }
        else {
            this.wallet.status = this.wallet.cachedStatus;
            if (this.wallet.completeHistory)
                this.showHistory();
        }
        this.requiresMultipleSignatures = this.wallet.credentials.m > 1;
        this.addressbookProvider
            .list()
            .then(ab => {
            this.addressbook = ab;
        })
            .catch(err => {
            this.logger.error(err);
        });
    }
    ionViewDidEnter() {
        this.updateAll();
    }
    ionViewWillEnter() {
        this.events.subscribe('bwsEvent', (walletId, type) => {
            if (walletId == this.wallet.id && type != 'NewAddress')
                this.updateAll();
        });
        this.events.subscribe('Local/TxAction', walletId => {
            if (walletId == this.wallet.id)
                this.updateAll();
        });
    }
    ionViewWillLeave() {
        this.events.unsubscribe('Local/TxAction');
        this.events.unsubscribe('bwsEvent');
    }
    clearHistoryCache() {
        this.history = [];
        this.currentPage = 0;
    }
    groupHistory(history) {
        return history.reduce((groups, tx, txInd) => {
            this.isFirstInGroup(txInd)
                ? groups.push([tx])
                : groups[groups.length - 1].push(tx);
            return groups;
        }, []);
    }
    showHistory() {
        this.history = this.wallet.completeHistory.slice(0, (this.currentPage + 1) * HISTORY_SHOW_LIMIT);
        this.groupedHistory = this.groupHistory(this.history);
        this.currentPage++;
    }
    getdata() {
        return this.http.get('https://api.cryptonator.com/api/ticker/btc-usd');
    }
    doRefresh(refresher) {
        refresher.pullMin = 90;
        this.getCurrentbtcPrice();
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.updateAll();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    getCurrentbtcPrice() {
        this.http.get('https://api.cryptonator.com/api/ticker/btc-usd')
            .map(res => res.json())
            .subscribe((data) => {
            const rprice = this.wallet.status.totalBalanceStr.split(" ");
            this.btc_api_data = data.ticker.price * rprice[0];
            this.btc_api_time = "a few seconds ago";
            Observable.interval(10000).subscribe(x => {
                const d = new Date(data.timestamp * 1000);
                // let myMoment: moment.Moment = moment(d).fromNow();
                let myMoment = moment(d).fromNow();
                this.btc_api_time = myMoment;
                this.logger.info(this.btc_api_time);
            });
        });
    }
    setPendingTxps(txps) {
        /* Uncomment to test multiple outputs */
        // var txp = {
        //   message: 'test multi-output',
        //   fee: 1000,
        //   createdOn: new Date() / 1000,
        //   outputs: [],
        //   wallet: $scope.wallet
        // };
        //
        // function addOutput(n) {
        //   txp.outputs.push({
        //     amount: 600,
        //     toAddress: '2N8bhEwbKtMvR2jqMRcTCQqzHP6zXGToXcK',
        //     message: 'output #' + (Number(n) + 1)
        //   });
        // };
        // lodash.times(15, addOutput);
        // txps.push(txp);
        this.txps = !txps ? [] : _.sortBy(txps, 'createdOn').reverse();
    }
    updateTxHistory() {
        this.updatingTxHistory = true;
        this.updateTxHistoryError = false;
        this.updatingTxHistoryProgress = 0;
        let progressFn = function (_, newTxs) {
            if (newTxs > 5)
                this.thistory = null;
            this.updatingTxHistoryProgress = newTxs;
        }.bind(this);
        this.walletProvider
            .getTxHistory(this.wallet, {
            progressFn
        })
            .then(txHistory => {
            this.updatingTxHistory = false;
            let hasTx = txHistory[0];
            this.showNoTransactionsYetMsg = hasTx ? false : true;
            this.wallet.completeHistory = txHistory;
            this.showHistory();
        })
            .catch(() => {
            this.updatingTxHistory = false;
            this.updateTxHistoryError = true;
        });
    }
    toggleBalance() {
        this.profileProvider.toggleHideBalanceFlag(this.wallet.credentials.walletId);
    }
    loadHistory(loading) {
        if (this.history.length === this.wallet.completeHistory.length) {
            loading.complete();
            return;
        }
        setTimeout(() => {
            this.showHistory();
            loading.complete();
        }, 300);
    }
    updateStatus(force) {
        this.updatingStatus = true;
        this.updateStatusError = null;
        this.walletNotRegistered = false;
        this.showBalanceButton = false;
        this.walletProvider
            .getStatus(this.wallet, { force: !!force })
            .then(status => {
            this.updatingStatus = false;
            this.setPendingTxps(status.pendingTxps);
            this.wallet.status = status;
            this.showBalanceButton =
                this.wallet.status.totalBalanceSat !=
                    this.wallet.status.spendableAmount;
        })
            .catch(err => {
            this.updatingStatus = false;
            if (err === 'WALLET_NOT_REGISTERED') {
                this.walletNotRegistered = true;
            }
            else {
                this.updateStatusError = this.bwcError.msg(err, this.translate.instant('Could not update wallet'));
            }
            this.wallet.status = null;
        });
    }
    recreate() {
        this.onGoingProcessProvider.set('recreating');
        this.walletProvider
            .recreate(this.wallet)
            .then(() => {
            this.onGoingProcessProvider.clear();
            setTimeout(() => {
                this.walletProvider.startScan(this.wallet).then(() => {
                    this.updateAll(true);
                });
            });
        })
            .catch(err => {
            this.onGoingProcessProvider.clear();
            this.logger.error(err);
        });
    }
    goToTxDetails(tx) {
        this.navCtrl.push(TxDetailsPage, {
            walletId: this.wallet.credentials.walletId,
            txid: tx.txid
        });
    }
    openBackup() {
        this.navCtrl.push(BackupWarningPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    openAddresses() {
        this.navCtrl.push(WalletAddressesPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    getDate(txCreated) {
        let date = new Date(txCreated * 1000);
        return date;
    }
    trackByFn(index) {
        return index;
    }
    isFirstInGroup(index) {
        if (index === 0) {
            return true;
        }
        let curTx = this.history[index];
        let prevTx = this.history[index - 1];
        return !this.createdDuringSameMonth(curTx, prevTx);
    }
    createdDuringSameMonth(curTx, prevTx) {
        return this.timeProvider.withinSameMonth(curTx.time * 1000, prevTx.time * 1000);
    }
    isDateInCurrentMonth(date) {
        return this.timeProvider.isDateInCurrentMonth(date);
    }
    createdWithinPastDay(time) {
        return this.timeProvider.withinPastDay(time);
    }
    isUnconfirmed(tx) {
        return !tx.confirmations || tx.confirmations === 0;
    }
    openBalanceDetails() {
        this.navCtrl.push(WalletBalancePage, { status: this.wallet.status });
    }
    back() {
        this.navCtrl.pop();
    }
    openSearchModal() {
        let modal = this.modalCtrl.create(SearchTxModalPage, {
            addressbook: this.addressbook,
            completeHistory: this.wallet.completeHistory,
            wallet: this.wallet
        }, { showBackdrop: false, enableBackdropDismiss: true });
        modal.present();
        modal.onDidDismiss(data => {
            if (!data || !data.txid)
                return;
            this.navCtrl.push(TxDetailsPage, {
                walletId: this.wallet.credentials.walletId,
                txid: data.txid
            });
        });
    }
    openExternalLink(url) {
        let optIn = true;
        let title = null;
        let message = this.translate.instant('Help and support information is available at the website.');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
};
WalletDetailsPage = __decorate([
    Component({
        selector: 'page-wallet-details',
        templateUrl: 'wallet-details.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        ProfileProvider,
        WalletProvider,
        AddressBookProvider,
        BwcErrorProvider,
        Events,
        Logger,
        TimeProvider,
        TranslateService,
        ModalController,
        OnGoingProcessProvider,
        ExternalLinkProvider,
        Http])
], WalletDetailsPage);
export { WalletDetailsPage };
//# sourceMappingURL=wallet-details.js.map