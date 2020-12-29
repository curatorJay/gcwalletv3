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
import { Events, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../../providers/logger/logger';
// providers
import { ConfigProvider } from '../../../../providers/config/config';
import { ProfileProvider } from '../../../../providers/profile/profile';
let WalletColorPage = class WalletColorPage {
    constructor(profileProvider, navCtrl, navParams, configProvider, logger, events) {
        this.profileProvider = profileProvider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.configProvider = configProvider;
        this.logger = logger;
        this.events = events;
        this.retries = 3;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad WalletColorPage');
    }
    ionViewWillEnter() {
        const COLOR_COUNT = 14;
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.colorCount = Array(COLOR_COUNT)
            .fill(0)
            .map((_, i) => i);
        this.setCurrentColorIndex();
    }
    save(i) {
        let color = this.indexToColor(i);
        if (!color)
            return;
        let opts = {
            colorFor: {}
        };
        opts.colorFor[this.wallet.credentials.walletId] = color;
        this.configProvider.set(opts);
        this.events.publish('wallet:updated', this.wallet.credentials.walletId);
        this.navCtrl.pop();
    }
    setCurrentColorIndex() {
        try {
            this.currentColorIndex = this.colorToIndex(this.wallet.color);
        }
        catch (e) {
            // Wait for DOM to render and try again.
            setTimeout(() => {
                if (this.retries > 0) {
                    this.retries -= 1;
                    this.setCurrentColorIndex();
                }
            }, 100);
        }
    }
    colorToIndex(color) {
        for (let i = 0; i < this.colorCount.length; i++) {
            if (this.indexToColor(i) == color.toLowerCase()) {
                return i;
            }
        }
        return undefined;
    }
    indexToColor(i) {
        // Expect an exception to be thrown if can't getComputedStyle().
        return this.rgb2hex(window.getComputedStyle(document.getElementsByClassName('wallet-color-' + i)[0]).backgroundColor);
    }
    rgb2hex(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return rgb && rgb.length === 4
            ? '#' +
                ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2)
            : '';
    }
};
WalletColorPage = __decorate([
    Component({
        selector: 'page-wallet-color',
        templateUrl: 'wallet-color.html'
    }),
    __metadata("design:paramtypes", [ProfileProvider,
        NavController,
        NavParams,
        ConfigProvider,
        Logger,
        Events])
], WalletColorPage);
export { WalletColorPage };
//# sourceMappingURL=wallet-color.js.map