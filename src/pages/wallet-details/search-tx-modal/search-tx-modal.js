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
import { NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';
// Providers
import { PlatformProvider } from '../../../providers/platform/platform';
import { TimeProvider } from '../../../providers/time/time';
let SearchTxModalPage = class SearchTxModalPage {
    constructor(navParams, platformProvider, timeProvider, viewCtrl) {
        this.navParams = navParams;
        this.platformProvider = platformProvider;
        this.timeProvider = timeProvider;
        this.viewCtrl = viewCtrl;
        this.throttleSearch = _.throttle((search) => {
            this.txHistorySearchResults = this.filter(search).slice(0, this.HISTORY_SHOW_LIMIT);
        }, 1000);
        this.HISTORY_SHOW_LIMIT = 10;
        this.currentTxHistoryPage = 0;
        this.txHistorySearchResults = [];
        this.isCordova = this.platformProvider.isCordova;
        this.addressbook = this.navParams.data.addressbook;
        this.completeTxHistory = this.navParams.data.completeHistory;
        this.wallet = this.navParams.data.wallet;
    }
    close(txid) {
        this.viewCtrl.dismiss({ txid });
    }
    updateSearchInput(search) {
        this.currentTxHistoryPage = 0;
        this.throttleSearch(search);
    }
    filter(search) {
        this.filteredTxHistory = [];
        if (_.isEmpty(search)) {
            this.txHistoryShowMore = false;
            return [];
        }
        this.filteredTxHistory = _.filter(this.completeTxHistory, tx => {
            if (!tx.searcheableString)
                tx.searcheableString = this.computeSearchableString(tx);
            return _.includes(tx.searcheableString, search.toLowerCase());
        });
        this.txHistoryShowMore =
            this.filteredTxHistory.length > this.HISTORY_SHOW_LIMIT ? true : false;
        return this.filteredTxHistory;
    }
    computeSearchableString(tx) {
        let addressBook = '';
        if (tx.addressTo && this.addressbook && this.addressbook[tx.addressTo])
            addressBook =
                this.addressbook[tx.addressTo].name ||
                    this.addressbook[tx.addressTo] ||
                    '';
        let searchableDate = this.computeSearchableDate(new Date(tx.time * 1000));
        let message = tx.message ? tx.message : '';
        let comment = tx.note ? tx.note.body : '';
        let addressTo = tx.addressTo ? tx.addressTo : '';
        let txid = tx.txid ? tx.txid : '';
        return (tx.amountStr +
            message +
            addressTo +
            addressBook +
            searchableDate +
            comment +
            txid)
            .toString()
            .toLowerCase();
    }
    computeSearchableDate(date) {
        let day = ('0' + date.getDate()).slice(-2).toString();
        let month = ('0' + (date.getMonth() + 1)).slice(-2).toString();
        let year = date.getFullYear();
        return [month, day, year].join('/');
    }
    moreSearchResults(loading) {
        setTimeout(() => {
            this.currentTxHistoryPage++;
            this.showHistory();
            loading.complete();
        }, 100);
    }
    showHistory() {
        this.txHistorySearchResults = this.filteredTxHistory
            ? this.filteredTxHistory.slice(0, (this.currentTxHistoryPage + 1) * this.HISTORY_SHOW_LIMIT)
            : [];
        this.txHistoryShowMore =
            this.filteredTxHistory.length > this.txHistorySearchResults.length;
    }
    trackByFn(index) {
        return index;
    }
    createdWithinPastDay(time) {
        return this.timeProvider.withinPastDay(time);
    }
};
SearchTxModalPage = __decorate([
    Component({
        selector: 'page-search-tx-modal',
        templateUrl: 'search-tx-modal.html'
    }),
    __metadata("design:paramtypes", [NavParams,
        PlatformProvider,
        TimeProvider,
        ViewController])
], SearchTxModalPage);
export { SearchTxModalPage };
//# sourceMappingURL=search-tx-modal.js.map