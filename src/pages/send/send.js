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
import { Events, NavController } from 'ionic-angular';
import * as _ from 'lodash';
// Providers
import { AddressBookProvider } from '../../providers/address-book/address-book';
import { AddressProvider } from '../../providers/address/address';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { IncomingDataProvider } from '../../providers/incoming-data/incoming-data';
import { Logger } from '../../providers/logger/logger';
import { PopupProvider } from '../../providers/popup/popup';
import { ProfileProvider } from '../../providers/profile/profile';
import { WalletProvider } from '../../providers/wallet/wallet';
// Pages
import { PaperWalletPage } from '../paper-wallet/paper-wallet';
import { AddressbookAddPage } from '../settings/addressbook/add/add';
import { AmountPage } from './amount/amount';
let SendPage = class SendPage {
    constructor(navCtrl, profileProvider, walletProvider, addressBookProvider, logger, incomingDataProvider, popupProvider, addressProvider, events, externalLinkProvider) {
        this.navCtrl = navCtrl;
        this.profileProvider = profileProvider;
        this.walletProvider = walletProvider;
        this.addressBookProvider = addressBookProvider;
        this.logger = logger;
        this.incomingDataProvider = incomingDataProvider;
        this.popupProvider = popupProvider;
        this.addressProvider = addressProvider;
        this.events = events;
        this.externalLinkProvider = externalLinkProvider;
        this.search = '';
        this.contactsList = [];
        this.filteredContactsList = [];
        this.CONTACTS_SHOW_LIMIT = 10;
        this.currentContactsPage = 0;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad SendPage');
    }
    ionViewWillLeave() {
        this.events.unsubscribe('finishIncomingDataMenuEvent');
    }
    ionViewWillEnter() {
        this.walletsBtc = this.profileProvider.getWallets({ coin: 'btc' });
        this.walletsBch = this.profileProvider.getWallets({ coin: 'bch' });
        this.hasBtcWallets = !_.isEmpty(this.walletsBtc);
        this.hasBchWallets = !_.isEmpty(this.walletsBch);
        this.events.subscribe('finishIncomingDataMenuEvent', data => {
            switch (data.redirTo) {
                case 'AmountPage':
                    this.sendPaymentToAddress(data.value, data.coin);
                    break;
                case 'AddressBookPage':
                    this.addToAddressBook(data.value);
                    break;
                case 'OpenExternalLink':
                    this.goToUrl(data.value);
                    break;
                case 'PaperWalletPage':
                    this.scanPaperWallet(data.value);
                    break;
            }
        });
        this.updateBchWalletsList();
        this.updateBtcWalletsList();
        this.updateContactsList();
    }
    ionViewDidEnter() {
        this.search = '';
    }
    goToUrl(url) {
        this.externalLinkProvider.open(url);
    }
    sendPaymentToAddress(bitcoinAddress, coin) {
        this.navCtrl.push(AmountPage, { toAddress: bitcoinAddress, coin });
    }
    addToAddressBook(bitcoinAddress) {
        this.navCtrl.push(AddressbookAddPage, { addressbookEntry: bitcoinAddress });
    }
    scanPaperWallet(privateKey) {
        this.navCtrl.push(PaperWalletPage, { privateKey });
    }
    updateBchWalletsList() {
        this.walletBchList = [];
        if (!this.hasBchWallets)
            return;
        _.each(this.walletsBch, v => {
            this.walletBchList.push({
                color: v.color,
                name: v.name,
                recipientType: 'wallet',
                coin: v.coin,
                network: v.network,
                m: v.credentials.m,
                n: v.credentials.n,
                isComplete: v.isComplete(),
                needsBackup: v.needsBackup,
                getAddress: () => {
                    return new Promise((resolve, reject) => {
                        this.walletProvider
                            .getAddress(v, false)
                            .then(addr => {
                            return resolve(addr);
                        })
                            .catch(err => {
                            return reject(err);
                        });
                    });
                }
            });
        });
    }
    updateBtcWalletsList() {
        this.walletBtcList = [];
        if (!this.hasBtcWallets)
            return;
        _.each(this.walletsBtc, v => {
            this.walletBtcList.push({
                color: v.color,
                name: v.name,
                recipientType: 'wallet',
                coin: v.coin,
                network: v.network,
                m: v.credentials.m,
                n: v.credentials.n,
                isComplete: v.isComplete(),
                needsBackup: v.needsBackup,
                getAddress: () => {
                    return new Promise((resolve, reject) => {
                        this.walletProvider
                            .getAddress(v, false)
                            .then(addr => {
                            return resolve(addr);
                        })
                            .catch(err => {
                            return reject(err);
                        });
                    });
                }
            });
        });
    }
    updateContactsList() {
        this.addressBookProvider.list().then(ab => {
            this.hasContacts = _.isEmpty(ab) ? false : true;
            if (!this.hasContacts)
                return;
            this.contactsList = [];
            _.each(ab, (v, k) => {
                this.contactsList.push({
                    name: _.isObject(v) ? v.name : v,
                    address: k,
                    network: this.addressProvider.validateAddress(k).network,
                    email: _.isObject(v) ? v.email : null,
                    recipientType: 'contact',
                    coin: this.addressProvider.validateAddress(k).coin,
                    getAddress: () => {
                        return new Promise(resolve => {
                            return resolve(k);
                        });
                    }
                });
            });
            let shortContactsList = _.clone(this.contactsList.slice(0, (this.currentContactsPage + 1) * this.CONTACTS_SHOW_LIMIT));
            this.filteredContactsList = _.clone(shortContactsList);
            this.contactsShowMore =
                this.contactsList.length > shortContactsList.length;
        });
    }
    showMore() {
        this.currentContactsPage++;
        this.updateContactsList();
    }
    openScanner() {
        this.navCtrl.parent.select(2);
    }
    findContact(search) {
        if (this.incomingDataProvider.redir(search))
            return;
        if (search && search.trim() != '') {
            let result = _.filter(this.contactsList, item => {
                let val = item.name;
                return _.includes(val.toLowerCase(), search.toLowerCase());
            });
            this.filteredContactsList = result;
        }
        else {
            this.updateContactsList();
        }
    }
    goToAmount(item) {
        item
            .getAddress()
            .then((addr) => {
            if (!addr) {
                // Error is already formated
                this.popupProvider.ionicAlert('Error - no address');
                return;
            }
            this.logger.debug('Got address:' + addr + ' | ' + item.name);
            this.navCtrl.push(AmountPage, {
                recipientType: item.recipientType,
                toAddress: addr,
                name: item.name,
                email: item.email,
                color: item.color,
                coin: item.coin,
                network: item.network
            });
            return;
        })
            .catch(err => {
            this.logger.error('Send: could not getAddress', err);
        });
    }
};
SendPage = __decorate([
    Component({
        selector: 'page-send',
        templateUrl: 'send.html'
    }),
    __metadata("design:paramtypes", [NavController,
        ProfileProvider,
        WalletProvider,
        AddressBookProvider,
        Logger,
        IncomingDataProvider,
        PopupProvider,
        AddressProvider,
        Events,
        ExternalLinkProvider])
], SendPage);
export { SendPage };
//# sourceMappingURL=send.js.map