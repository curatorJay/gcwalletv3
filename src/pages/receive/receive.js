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
import { ActionSheetController, Events, NavController } from 'ionic-angular';
import { Logger } from '../../providers/logger/logger';
// Native
import { SocialSharing } from '@ionic-native/social-sharing';
// Pages
import { BackupWarningPage } from '../backup/backup-warning/backup-warning';
import { AmountPage } from '../send/amount/amount';
import { CopayersPage } from './../add/copayers/copayers';
// Providers
import { AddressProvider } from '../../providers/address/address';
import { BwcErrorProvider } from '../../providers/bwc-error/bwc-error';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { PlatformProvider } from '../../providers/platform/platform';
import { ProfileProvider } from '../../providers/profile/profile';
import { WalletProvider } from '../../providers/wallet/wallet';
import * as _ from 'lodash';
import { PopupProvider } from '../../providers/popup/popup';
let ReceivePage = class ReceivePage {
    constructor(actionSheetCtrl, navCtrl, logger, profileProvider, walletProvider, platformProvider, events, socialSharing, bwcErrorProvider, translate, externalLinkProvider, addressProvider, popupProvider) {
        this.actionSheetCtrl = actionSheetCtrl;
        this.navCtrl = navCtrl;
        this.logger = logger;
        this.profileProvider = profileProvider;
        this.walletProvider = walletProvider;
        this.platformProvider = platformProvider;
        this.events = events;
        this.socialSharing = socialSharing;
        this.bwcErrorProvider = bwcErrorProvider;
        this.translate = translate;
        this.externalLinkProvider = externalLinkProvider;
        this.addressProvider = addressProvider;
        this.popupProvider = popupProvider;
        this.wallets = [];
        this.showShareButton = this.platformProvider.isCordova;
    }
    ionViewWillEnter() {
        this.isOpenSelector = false;
        this.wallets = this.profileProvider.getWallets();
        this.onWalletSelect(this.checkSelectedWallet(this.wallet, this.wallets));
        this.events.subscribe('bwsEvent', (walletId, type) => {
            // Update current address
            if (this.wallet && walletId == this.wallet.id && type == 'NewIncomingTx')
                this.setAddress(true);
        });
    }
    ionViewWillLeave() {
        this.events.unsubscribe('bwsEvent');
    }
    onWalletSelect(wallet) {
        this.wallet = wallet;
        this.wallet.needsBackupUrgent = false; // ** ATTN! Adding new property to add one more layer to filter backup necesecity since v1.2
        if (this.wallet) {
            this.setAddress(false, true);
        }
    }
    checkSelectedWallet(wallet, wallets) {
        if (!wallet)
            return wallets[0];
        let w = _.find(wallets, w => {
            return w.id == wallet.id;
        });
        if (!w)
            return wallets[0];
        return wallet;
    }
    requestSpecificAmount() {
        this.navCtrl.push(AmountPage, {
            toAddress: this.address,
            id: this.wallet.credentials.walletId,
            recipientType: 'wallet',
            name: this.wallet.name,
            color: this.wallet.color,
            coin: this.wallet.coin,
            nextPage: 'CustomAmountPage',
            network: this.addressProvider.validateAddress(this.address).network
        });
    }
    setAddress(newAddr, changingWallet) {
        this.wallet.needsBackupUrgent = false; // ** ATTN! Adding new property to add one more layer to filter backup necesecity since v1.2
        this.loading =
            newAddr || _.isEmpty(this.address) || changingWallet ? true : false;
        // console.log(this.wallet);
        this.walletProvider
            .getAddress(this.wallet, newAddr)
            .then(addr => {
            this.loading = false;
            this.address = this.walletProvider.getAddressView(this.wallet, addr);
            this.updateQrAddress();
        })
            .catch(err => {
            this.loading = false;
            this.logger.warn(this.bwcErrorProvider.msg(err, 'Server Error'));
        });
    }
    updateQrAddress() {
        this.qrAddress = this.walletProvider.getProtoAddress(this.wallet, this.address);
    }
    shareAddress() {
        if (!this.showShareButton)
            return;
        this.socialSharing.share(this.address);
    }
    showWallets() {
        this.isOpenSelector = true;
        let id = this.wallet ? this.wallet.credentials.walletId : null;
        this.events.publish('showWalletsSelectorEvent', this.wallets, id);
        this.events.subscribe('selectWalletEvent', wallet => {
            if (!_.isEmpty(wallet))
                this.onWalletSelect(wallet);
            this.events.unsubscribe('selectWalletEvent');
            this.isOpenSelector = false;
        });
    }
    goCopayers() {
        this.navCtrl.push(CopayersPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    goToBackup() {
        const backupWarningModal = this.popupProvider.createMiniModal('backup-needed');
        backupWarningModal.present({
            animate: false
        });
        backupWarningModal.onDidDismiss(goToBackupPage => {
            if (goToBackupPage)
                this.navCtrl.push(BackupWarningPage, {
                    walletId: this.wallet.credentials.walletId
                });
        });
    }
    openWikiBackupNeeded() {
        let url = 'https://getcoins.com/faq';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('Read more in our FAQ');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    showMoreOptions() {
        let buttons = [];
        let specificAmountButton = {
            text: this.translate.instant('Request Specific Amount'),
            handler: () => {
                this.requestSpecificAmount();
            }
        };
        let shareButton = {
            text: this.translate.instant('Share Address'),
            handler: () => {
                this.shareAddress();
            }
        };
        buttons.push(specificAmountButton);
        if (this.showShareButton &&
            this.wallet &&
            this.wallet.isComplete() &&
            !this.wallet.needsBackup)
            buttons.push(shareButton);
        const actionSheet = this.actionSheetCtrl.create({
            buttons
        });
        actionSheet.present();
    }
};
ReceivePage = __decorate([
    Component({
        selector: 'page-receive',
        templateUrl: 'receive.html'
    }),
    __metadata("design:paramtypes", [ActionSheetController,
        NavController,
        Logger,
        ProfileProvider,
        WalletProvider,
        PlatformProvider,
        Events,
        SocialSharing,
        BwcErrorProvider,
        TranslateService,
        ExternalLinkProvider,
        AddressProvider,
        PopupProvider])
], ReceivePage);
export { ReceivePage };
//# sourceMappingURL=receive.js.map