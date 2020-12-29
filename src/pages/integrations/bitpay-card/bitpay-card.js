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
import { NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// Pages
import { AmountPage } from '../../send/amount/amount';
// providers
import { BitPayCardProvider } from '../../../providers/bitpay-card/bitpay-card';
import { BitPayProvider } from '../../../providers/bitpay/bitpay';
import { ExternalLinkProvider } from '../../../providers/external-link/external-link';
import { PopupProvider } from '../../../providers/popup/popup';
import { TimeProvider } from '../../../providers/time/time';
import * as _ from 'lodash';
import * as moment from 'moment';
let BitPayCardPage = class BitPayCardPage {
    constructor(translate, bitPayProvider, bitPayCardProvider, logger, popupProvider, timeProvider, externalLinkProvider, navParams, navCtrl) {
        this.translate = translate;
        this.bitPayProvider = bitPayProvider;
        this.bitPayCardProvider = bitPayCardProvider;
        this.logger = logger;
        this.popupProvider = popupProvider;
        this.timeProvider = timeProvider;
        this.externalLinkProvider = externalLinkProvider;
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.okText = this.translate.instant('Ok');
        this.cancelText = this.translate.instant('Cancel');
        this.dateRange = {
            value: 'last30Days'
        };
        this.network = this.bitPayProvider.getEnvironment().network;
        this.cardId = this.navParams.data.id;
        if (!this.cardId)
            this.navCtrl.pop();
        this.bitPayCardProvider.get({
            cardId: this.cardId,
            noRefresh: true
        }, (_, cards) => {
            if (cards && cards[0]) {
                this.lastFourDigits = cards[0].lastFourDigits;
                this.balance = cards[0].balance;
                this.currencySymbol = cards[0].currencySymbol;
                this.updatedOn = cards[0].updatedOn;
                this.currency = cards[0].currency;
            }
            this.update();
        });
    }
    setDateRange(preset) {
        let startDate;
        let endDate;
        preset = preset || 'last30Days';
        switch (preset) {
            case 'last30Days':
                startDate = moment()
                    .subtract(30, 'days')
                    .toISOString();
                endDate = moment().toISOString();
                break;
            case 'lastMonth':
                startDate = moment()
                    .startOf('month')
                    .subtract(1, 'month')
                    .toISOString();
                endDate = moment()
                    .startOf('month')
                    .toISOString();
                break;
            case 'all':
                startDate = null;
                endDate = null;
                break;
            default:
                return undefined;
        }
        return {
            startDate,
            endDate
        };
    }
    setGetStarted(history, cb) {
        // Is the card new?
        if (!_.isEmpty(history.transactionList))
            return cb();
        let dateRange = this.setDateRange('all');
        this.bitPayCardProvider.getHistory(this.cardId, dateRange, (err, history) => {
            if (!err && _.isEmpty(history.transactionList))
                this.getStarted = true;
            return cb();
        });
    }
    update() {
        let dateRange = this.setDateRange(this.dateRange.value);
        this.loadingHistory = true;
        this.bitPayCardProvider.getHistory(this.cardId, dateRange, (err, history) => {
            this.loadingHistory = false;
            if (err) {
                this.logger.error(err);
                this.bitpayCardTransactionHistoryCompleted = null;
                this.bitpayCardTransactionHistoryConfirming = null;
                this.bitpayCardTransactionHistoryPreAuth = null;
                this.balance = null;
                this.popupProvider.ionicAlert('Error', this.translate.instant('Could not get transactions'));
                return;
            }
            this.setGetStarted(history, () => {
                let txs = _.clone(history.txs);
                this.setDateTime(txs);
                this.bitpayCardTransactionHistoryConfirming = this.bitPayCardProvider.filterTransactions('confirming', txs);
                this.bitpayCardTransactionHistoryCompleted = this.bitPayCardProvider.filterTransactions('completed', txs);
                this.bitpayCardTransactionHistoryPreAuth = this.bitPayCardProvider.filterTransactions('preAuth', txs);
                this.balance = history.currentCardBalance;
                this.updatedOn = null;
                if (this.dateRange.value == 'last30Days') {
                    // TODO?
                    // $log.debug('BitPay Card: storing cache history');
                    // let cacheHistory = {
                    //   balance: history.currentCardBalance,
                    //   transactions: history.txs
                    // };
                    // this.bitPayCardProvider.setHistory($scope.cardId, cacheHistory, {}, (err) => {
                    //   if (err) $log.error(err);
                    //   $scope.historyCached = true;
                    // });
                }
            });
        });
    }
    setDateTime(txs) {
        let txDate, txDateUtc;
        let newDate;
        for (let i = 0; i < txs.length; i++) {
            txDate = new Date(txs[i].date);
            txDateUtc = new Date(txs[i].date.replace('Z', ''));
            let amTime = this.createdWithinPastDay(txs[i]);
            newDate = amTime
                ? moment(txDateUtc).fromNow()
                : moment(txDate)
                    .utc()
                    .format('MMM D, YYYY');
            txs[i].date = newDate;
        }
    }
    createdWithinPastDay(tx) {
        let result = false;
        if (tx.date) {
            result = this.timeProvider.withinPastDay(tx.date);
        }
        return result;
    }
    openExternalLink(url) {
        let optIn = true;
        let title = null;
        let message = this.translate.instant('Help and support information is available at the website.');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    viewOnBlockchain(transactionId) {
        let url = 'https://insight.bitpay.com/tx/' + transactionId;
        let optIn = true;
        let title = null;
        let message = this.translate.instant('View Transaction on Insight');
        let okText = this.translate.instant('Open Insight');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    topUp() {
        this.navCtrl.push(AmountPage, {
            id: this.cardId,
            nextPage: 'BitPayCardTopUpPage',
            currency: this.currency
        });
    }
};
BitPayCardPage = __decorate([
    Component({
        selector: 'page-bitpay-card',
        templateUrl: 'bitpay-card.html'
    }),
    __metadata("design:paramtypes", [TranslateService,
        BitPayProvider,
        BitPayCardProvider,
        Logger,
        PopupProvider,
        TimeProvider,
        ExternalLinkProvider,
        NavParams,
        NavController])
], BitPayCardPage);
export { BitPayCardPage };
//# sourceMappingURL=bitpay-card.js.map