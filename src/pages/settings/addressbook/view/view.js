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
// Pages
import { AmountPage } from '../../../../pages/send/amount/amount';
// Providers
import { AddressBookProvider } from '../../../../providers/address-book/address-book';
import { AddressProvider } from '../../../../providers/address/address';
import { BwcProvider } from '../../../../providers/bwc/bwc';
import { PopupProvider } from '../../../../providers/popup/popup';
let AddressbookViewPage = class AddressbookViewPage {
    constructor(addressBookProvider, addressProvider, bwcProvider, navCtrl, navParams, popupProvider, translate) {
        this.addressBookProvider = addressBookProvider;
        this.addressProvider = addressProvider;
        this.bwcProvider = bwcProvider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.popupProvider = popupProvider;
        this.translate = translate;
        this.bitcoreCash = this.bwcProvider.getBitcoreCash();
        this.address = this.navParams.data.contact.address;
        this.name = this.navParams.data.contact.name;
        this.email = this.navParams.data.contact.email;
        const cashAddress = this.bitcoreCash.Address.isValid(this.address, 'livenet');
        this.coin = cashAddress ? 'bch' : 'btc';
    }
    ionViewDidLoad() { }
    sendTo() {
        this.navCtrl.push(AmountPage, {
            toAddress: this.address,
            name: this.name,
            email: this.email,
            coin: this.coin,
            recipientType: 'contact',
            network: this.addressProvider.validateAddress(this.address).network
        });
    }
    remove(addr) {
        var title = this.translate.instant('Warning!');
        var message = this.translate.instant('Are you sure you want to delete this contact?');
        this.popupProvider.ionicConfirm(title, message, null, null).then(res => {
            if (!res)
                return;
            this.addressBookProvider
                .remove(addr)
                .then(() => {
                this.navCtrl.pop();
            })
                .catch(err => {
                this.popupProvider.ionicAlert(this.translate.instant('Error'), err);
                return;
            });
        });
    }
};
AddressbookViewPage = __decorate([
    Component({
        selector: 'page-addressbook-view',
        templateUrl: 'view.html'
    }),
    __metadata("design:paramtypes", [AddressBookProvider,
        AddressProvider,
        BwcProvider,
        NavController,
        NavParams,
        PopupProvider,
        TranslateService])
], AddressbookViewPage);
export { AddressbookViewPage };
//# sourceMappingURL=view.js.map