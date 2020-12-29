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
import { NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
// Providers
import { BitPayAccountProvider } from '../../../../providers/bitpay-account/bitpay-account';
import { BitPayCardProvider } from '../../../../providers/bitpay-card/bitpay-card';
import { ConfigProvider } from '../../../../providers/config/config';
import { HomeIntegrationsProvider } from '../../../../providers/home-integrations/home-integrations';
import { PopupProvider } from '../../../../providers/popup/popup';
let BitPaySettingsPage = class BitPaySettingsPage {
    constructor(navParams, navCtrl, bitpayAccountProvider, bitPayCardProvider, popupProvider, configProvider, homeIntegrationsProvider) {
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.bitpayAccountProvider = bitpayAccountProvider;
        this.bitPayCardProvider = bitPayCardProvider;
        this.popupProvider = popupProvider;
        this.configProvider = configProvider;
        this.homeIntegrationsProvider = homeIntegrationsProvider;
        this.serviceName = 'debitcard';
        this.service = _.filter(this.homeIntegrationsProvider.get(), {
            name: this.serviceName
        });
        this.showAtHome = !!this.service[0].show;
    }
    ionViewWillEnter() {
        let cardId = this.navParams.data.id;
        if (cardId) {
            this.bitPayCardProvider.getCards(cards => {
                this.bitpayCard = _.find(cards, { id: cardId });
            });
        }
        else {
            this.service = _.filter(this.homeIntegrationsProvider.get(), {
                name: this.serviceName
            });
            this.showAtHome = !!this.service[0].show;
        }
    }
    integrationChange() {
        let opts = {
            showIntegration: { [this.serviceName]: this.showAtHome }
        };
        this.homeIntegrationsProvider.updateConfig(this.serviceName, this.showAtHome);
        this.configProvider.set(opts);
    }
    unlinkCard(card) {
        let title = 'Unlink BitPay Card?';
        let msg = 'Are you sure you would like to remove your BitPay Card (' +
            card.lastFourDigits +
            ') from this device?';
        this.popupProvider.ionicConfirm(title, msg).then(res => {
            if (res) {
                this.bitPayCardProvider.remove(card.id, err => {
                    if (err) {
                        this.popupProvider.ionicAlert('Error', 'Could not remove the card');
                        return;
                    }
                    this.navCtrl.pop();
                });
            }
        });
    }
    unlinkAccount(card) {
        let title = 'Unlink BitPay Account?';
        let msg = 'Are you sure you would like to remove your BitPay Account (' +
            card.email +
            ') and all associated cards from this device?';
        this.popupProvider.ionicConfirm(title, msg).then(res => {
            if (res) {
                this.bitpayAccountProvider.removeAccount(card.email, () => {
                    this.navCtrl.pop();
                });
            }
        });
    }
};
BitPaySettingsPage = __decorate([
    Component({
        selector: 'page-bitpay-settings',
        templateUrl: 'bitpay-settings.html'
    }),
    __metadata("design:paramtypes", [NavParams,
        NavController,
        BitPayAccountProvider,
        BitPayCardProvider,
        PopupProvider,
        ConfigProvider,
        HomeIntegrationsProvider])
], BitPaySettingsPage);
export { BitPaySettingsPage };
//# sourceMappingURL=bitpay-settings.js.map