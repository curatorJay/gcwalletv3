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
import { Events, Platform } from 'ionic-angular';
let WalletSelectorPage = class WalletSelectorPage {
    constructor(events, platform) {
        this.events = events;
        this.platform = platform;
        this.showWalletsSelector = false;
        this.showSlideEffect = false;
        this.wallets = [];
        this.events.subscribe('showWalletsSelectorEvent', (wallets, selectedWalletId, title) => {
            this.title = title ? title : null;
            this.showWalletsSelector = true;
            this.selectedWalletId = selectedWalletId;
            setTimeout(() => {
                this.showSlideEffect = true;
            }, 50);
            this.wallets = wallets;
            this.separateWallets();
            let unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
                unregisterBackButtonAction();
                this.backdropDismiss();
            }, 0);
        });
    }
    selectWallet(wallet) {
        this.events.publish('selectWalletEvent', wallet);
        this.showSlideEffect = false;
        setTimeout(() => {
            this.showWalletsSelector = false;
        }, 150);
    }
    separateWallets() {
        this.walletsBtc = [];
        this.walletsBch = [];
        if (this.wallets.length == 0)
            return;
        for (var i = 0; i <= this.wallets.length; i++) {
            if (this.wallets[i]) {
                if (this.wallets[i].coin == 'btc')
                    this.walletsBtc.push(this.wallets[i]);
                else
                    this.walletsBch.push(this.wallets[i]);
            }
        }
    }
    backdropDismiss() {
        this.events.publish('selectWalletEvent');
        this.showSlideEffect = false;
        setTimeout(() => {
            this.showWalletsSelector = false;
        }, 150);
    }
};
WalletSelectorPage = __decorate([
    Component({
        selector: 'wallet-selector',
        templateUrl: 'wallet-selector.html'
    }),
    __metadata("design:paramtypes", [Events, Platform])
], WalletSelectorPage);
export { WalletSelectorPage };
//# sourceMappingURL=wallet-selector.js.map