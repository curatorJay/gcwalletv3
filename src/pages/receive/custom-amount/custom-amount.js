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
import { NavParams } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// Native
import { SocialSharing } from '@ionic-native/social-sharing';
// providers
import { PlatformProvider } from '../../../providers/platform/platform';
import { ProfileProvider } from '../../../providers/profile/profile';
import { TxFormatProvider } from '../../../providers/tx-format/tx-format';
import { WalletProvider } from '../../../providers/wallet/wallet';
let CustomAmountPage = class CustomAmountPage {
    constructor(navParams, profileProvider, platformProvider, walletProvider, logger, socialSharing, txFormatProvider) {
        this.navParams = navParams;
        this.profileProvider = profileProvider;
        this.platformProvider = platformProvider;
        this.walletProvider = walletProvider;
        this.logger = logger;
        this.socialSharing = socialSharing;
        this.txFormatProvider = txFormatProvider;
        let walletId = this.navParams.data.id;
        this.showShareButton = this.platformProvider.isCordova;
        this.wallet = this.profileProvider.getWallet(walletId);
        this.walletProvider.getAddress(this.wallet, false).then(addr => {
            this.address = this.walletProvider.getAddressView(this.wallet, addr);
            let parsedAmount = this.txFormatProvider.parseAmount(this.wallet.coin, this.navParams.data.amount, this.navParams.data.currency);
            // Amount in USD or BTC
            let _amount = parsedAmount.amount;
            let _currency = parsedAmount.currency;
            this.amountUnitStr = parsedAmount.amountUnitStr;
            if (_currency != 'BTC' && _currency != 'BCH') {
                // Convert to BTC or BCH
                let amountUnit = this.txFormatProvider.satToUnit(parsedAmount.amountSat);
                var btcParsedAmount = this.txFormatProvider.parseAmount(this.wallet.coin, amountUnit, this.wallet.coin.toUpperCase());
                this.amountCoin = btcParsedAmount.amount;
                this.altAmountStr = btcParsedAmount.amountUnitStr;
            }
            else {
                this.amountCoin = _amount; // BTC or BCH
                this.altAmountStr = this.txFormatProvider.formatAlternativeStr(this.wallet.coin, parsedAmount.amountSat);
            }
            this.updateQrAddress();
        });
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad CustomAmountPage');
    }
    updateQrAddress() {
        this.qrAddress =
            this.walletProvider.getProtoAddress(this.wallet, this.address) +
                '?amount=' +
                this.amountCoin;
    }
    shareAddress() {
        this.socialSharing.share(this.qrAddress);
    }
};
CustomAmountPage = __decorate([
    Component({
        selector: 'page-custom-amount',
        templateUrl: 'custom-amount.html'
    }),
    __metadata("design:paramtypes", [NavParams,
        ProfileProvider,
        PlatformProvider,
        WalletProvider,
        Logger,
        SocialSharing,
        TxFormatProvider])
], CustomAmountPage);
export { CustomAmountPage };
//# sourceMappingURL=custom-amount.js.map