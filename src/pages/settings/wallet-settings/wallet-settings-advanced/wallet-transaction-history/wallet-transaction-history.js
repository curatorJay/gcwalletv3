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
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import * as papa from 'papaparse';
import { Logger } from '../../../../../providers/logger/logger';
// Providers
import { AppProvider } from '../../../../../providers/app/app';
import { ConfigProvider } from '../../../../../providers/config/config';
import { PlatformProvider } from '../../../../../providers/platform/platform';
import { ProfileProvider } from '../../../../../providers/profile/profile';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
// Pages
import { WalletDetailsPage } from '../../../../../pages/wallet-details/wallet-details';
let WalletTransactionHistoryPage = class WalletTransactionHistoryPage {
    constructor(profileProvider, navCtrl, navParams, configProvider, logger, platformProvider, appProvider, walletProvider) {
        this.profileProvider = profileProvider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.configProvider = configProvider;
        this.logger = logger;
        this.platformProvider = platformProvider;
        this.appProvider = appProvider;
        this.walletProvider = walletProvider;
        this.csvReady = false;
        this.csvContent = [];
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad WalletTransactionHistoryPage');
    }
    ionViewWillEnter() {
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.currency = this.wallet.coin.toUpperCase();
        this.isCordova = this.platformProvider.isCordova;
        this.appName = this.appProvider.info.nameCase;
        this.config = this.configProvider.get();
        this.unitToSatoshi = this.config.wallet.settings.unitToSatoshi;
        this.unitDecimals = this.config.wallet.settings.unitDecimals;
        this.satToUnit = 1 / this.unitToSatoshi;
        this.satToBtc = 1 / 100000000;
        this.csvHistory();
    }
    formatDate(date) {
        var dateObj = new Date(date);
        if (!dateObj) {
            this.logger.debug('Error formating a date');
            return 'DateError';
        }
        if (!dateObj.toJSON()) {
            return '';
        }
        return dateObj.toJSON();
    }
    // TODO : move this to walletService.
    csvHistory() {
        this.logger.debug('Generating CSV from History');
        this.walletProvider
            .getTxHistory(this.wallet, {})
            .then(txs => {
            if (_.isEmpty(txs)) {
                this.logger.warn('Failed to generate CSV: no transactions');
                this.err = 'no transactions';
                return;
            }
            this.logger.debug('Wallet Transaction History Length:', txs.length);
            var data = txs;
            this.csvFilename = this.appName + '-' + this.wallet.name + '.csv';
            this.csvHeader = [
                'Date',
                'Destination',
                'Description',
                'Amount',
                'Currency',
                'Txid',
                'Creator',
                'Copayers',
                'Comment'
            ];
            var _amount, _note, _copayers, _creator, _comment;
            data.forEach(it => {
                var amount = it.amount;
                if (it.action == 'moved')
                    amount = 0;
                _copayers = '';
                _creator = '';
                if (it.actions && it.actions.length > 1) {
                    for (var i = 0; i < it.actions.length; i++) {
                        _copayers +=
                            it.actions[i].copayerName + ':' + it.actions[i].type + ' - ';
                    }
                    _creator =
                        it.creatorName && it.creatorName != 'undefined'
                            ? it.creatorName
                            : '';
                }
                _amount =
                    (it.action == 'sent' ? '-' : '') +
                        (amount * this.satToBtc).toFixed(8);
                _note = it.message || '';
                _comment = it.note ? it.note.body : '';
                if (it.action == 'moved')
                    _note += ' Moved:' + (it.amount * this.satToBtc).toFixed(8);
                this.csvContent.push({
                    Date: this.formatDate(it.time * 1000),
                    Destination: it.addressTo || '',
                    Description: _note,
                    Amount: _amount,
                    Currency: this.currency,
                    Txid: it.txid,
                    Creator: _creator,
                    Copayers: _copayers,
                    Comment: _comment
                });
                if (it.fees && (it.action == 'moved' || it.action == 'sent')) {
                    var _fee = (it.fees * this.satToBtc).toFixed(8);
                    this.csvContent.push({
                        Date: this.formatDate(it.time * 1000),
                        Destination: 'Bitcoin Network Fees',
                        Description: '',
                        Amount: '-' + _fee,
                        Currency: this.currency,
                        Txid: '',
                        Creator: '',
                        Copayers: ''
                    });
                }
            });
            this.csvReady = true;
        })
            .catch(err => {
            this.logger.warn('Failed to generate CSV:', err);
            this.err = err;
        });
    }
    downloadCSV() {
        if (!this.csvReady)
            return;
        let csv = papa.unparse({
            fields: this.csvHeader,
            data: this.csvContent
        });
        var blob = new Blob([csv]);
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = this.csvFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    clearTransactionHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info('Removing Transaction history ' + this.wallet.id);
            this.walletProvider.clearTxHistory(this.wallet);
            this.logger.info('Transaction history cleared for :' + this.wallet.id);
            yield this.navCtrl.popToRoot({ animate: false });
            yield this.navCtrl.parent.select(0);
            yield this.navCtrl.push(WalletDetailsPage, {
                walletId: this.wallet.credentials.walletId,
                clearCache: true
            });
        });
    }
};
WalletTransactionHistoryPage = __decorate([
    Component({
        selector: 'page-wallet-transaction-history',
        templateUrl: 'wallet-transaction-history.html'
    }),
    __metadata("design:paramtypes", [ProfileProvider,
        NavController,
        NavParams,
        ConfigProvider,
        Logger,
        PlatformProvider,
        AppProvider,
        WalletProvider])
], WalletTransactionHistoryPage);
export { WalletTransactionHistoryPage };
//# sourceMappingURL=wallet-transaction-history.js.map