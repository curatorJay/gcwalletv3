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
// providers
import { WalletProvider } from '../../providers/wallet/wallet';
let PayProPage = class PayProPage {
    constructor(navParams, viewCtrl, walletProvider) {
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.walletProvider = walletProvider;
        this.tx = this.navParams.data.tx;
        let wallet = this.navParams.data.wallet;
        this.address = this.walletProvider.getAddressView(wallet, this.tx.paypro.toAddress);
    }
    close() {
        this.viewCtrl.dismiss();
    }
};
PayProPage = __decorate([
    Component({
        selector: 'page-payrpo',
        templateUrl: 'paypro.html'
    }),
    __metadata("design:paramtypes", [NavParams,
        ViewController,
        WalletProvider])
], PayProPage);
export { PayProPage };
//# sourceMappingURL=paypro.js.map