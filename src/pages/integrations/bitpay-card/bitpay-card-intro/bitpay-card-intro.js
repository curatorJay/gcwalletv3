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
import { ActionSheetController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
// providers
import { BitPayAccountProvider } from '../../../../providers/bitpay-account/bitpay-account';
import { BitPayCardProvider } from '../../../../providers/bitpay-card/bitpay-card';
import { ExternalLinkProvider } from '../../../../providers/external-link/external-link';
import { PopupProvider } from '../../../../providers/popup/popup';
// pages
import { BitPayCardPage } from '../bitpay-card';
let BitPayCardIntroPage = class BitPayCardIntroPage {
    constructor(translate, actionSheetCtrl, navParams, bitPayAccountProvider, popupProvider, bitPayCardProvider, navCtrl, externalLinkProvider) {
        this.translate = translate;
        this.actionSheetCtrl = actionSheetCtrl;
        this.navParams = navParams;
        this.bitPayAccountProvider = bitPayAccountProvider;
        this.popupProvider = popupProvider;
        this.bitPayCardProvider = bitPayCardProvider;
        this.navCtrl = navCtrl;
        this.externalLinkProvider = externalLinkProvider;
    }
    ionViewWillEnter() {
        if (this.navParams.data.secret) {
            let pairData = {
                secret: this.navParams.data.secret,
                email: this.navParams.data.email,
                otp: this.navParams.data.otp
            };
            let pairingReason = this.translate.instant('add your BitPay Visa card(s)');
            this.bitPayAccountProvider.pair(pairData, pairingReason, (err, paired, apiContext) => {
                if (err) {
                    this.popupProvider.ionicAlert(this.translate.instant('Error pairing BitPay Account'), err);
                    return;
                }
                if (paired) {
                    this.bitPayCardProvider.sync(apiContext, (err, cards) => {
                        if (err) {
                            this.popupProvider.ionicAlert(this.translate.instant('Error updating Debit Cards'), err);
                            return;
                        }
                        // Fixes mobile navigation
                        setTimeout(() => {
                            if (cards[0]) {
                                this.navCtrl
                                    .push(BitPayCardPage, { id: cards[0].id }, { animate: false })
                                    .then(() => {
                                    let previousView = this.navCtrl.getPrevious();
                                    this.navCtrl.removeView(previousView);
                                });
                            }
                        }, 200);
                    });
                }
            });
        }
        this.bitPayAccountProvider.getAccounts((err, accounts) => {
            if (err) {
                this.popupProvider.ionicAlert(this.translate.instant('Error'), err);
                return;
            }
            this.accounts = accounts;
        });
    }
    bitPayCardInfo() {
        let url = 'https://bitpay.com/visa/faq';
        this.externalLinkProvider.open(url);
    }
    orderBitPayCard() {
        let url = 'https://bitpay.com/visa/get-started';
        this.externalLinkProvider.open(url);
    }
    connectBitPayCard() {
        if (this.accounts.length == 0) {
            this.startPairBitPayAccount();
        }
        else {
            this.showAccountSelector();
        }
    }
    startPairBitPayAccount() {
        this.navCtrl.popToRoot({ animate: false }); // Back to Root
        let url = 'https://bitpay.com/visa/dashboard/add-to-bitpay-wallet-confirm';
        this.externalLinkProvider.open(url);
    }
    showAccountSelector() {
        let options = [];
        _.forEach(this.accounts, account => {
            options.push({
                text: (account.givenName || account.familyName) +
                    ' (' +
                    account.email +
                    ')',
                handler: () => {
                    this.onAccountSelect(account);
                }
            });
        });
        // Add account
        options.push({
            text: this.translate.instant('Add account'),
            handler: () => {
                this.onAccountSelect();
            }
        });
        // Cancel
        options.push({
            text: this.translate.instant('Cancel'),
            role: 'cancel'
        });
        let actionSheet = this.actionSheetCtrl.create({
            title: this.translate.instant('From BitPay account'),
            buttons: options
        });
        actionSheet.present();
    }
    onAccountSelect(account) {
        if (_.isUndefined(account)) {
            this.startPairBitPayAccount();
        }
        else {
            this.bitPayCardProvider.sync(account.apiContext, err => {
                if (err) {
                    this.popupProvider.ionicAlert(this.translate.instant('Error'), err);
                    return;
                }
                this.navCtrl.pop();
            });
        }
    }
};
BitPayCardIntroPage = __decorate([
    Component({
        selector: 'page-bitpay-card-intro',
        templateUrl: 'bitpay-card-intro.html'
    }),
    __metadata("design:paramtypes", [TranslateService,
        ActionSheetController,
        NavParams,
        BitPayAccountProvider,
        PopupProvider,
        BitPayCardProvider,
        NavController,
        ExternalLinkProvider])
], BitPayCardIntroPage);
export { BitPayCardIntroPage };
//# sourceMappingURL=bitpay-card-intro.js.map