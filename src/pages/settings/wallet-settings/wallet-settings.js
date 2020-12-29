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
import { Logger } from '../../../providers/logger/logger';
// providers
import { ConfigProvider } from '../../../providers/config/config';
import { ExternalLinkProvider } from '../../../providers/external-link/external-link';
import { ProfileProvider } from '../../../providers/profile/profile';
import { TouchIdProvider } from '../../../providers/touchid/touchid';
import { WalletProvider } from '../../../providers/wallet/wallet';
// pages
import { BackupWarningPage } from '../../backup/backup-warning/backup-warning';
import { WalletColorPage } from './wallet-color/wallet-color';
import { WalletNamePage } from './wallet-name/wallet-name';
import { WalletSettingsAdvancedPage } from './wallet-settings-advanced/wallet-settings-advanced';
let WalletSettingsPage = class WalletSettingsPage {
    constructor(profileProvider, logger, walletProvider, externalLinkProvider, configProvider, navCtrl, navParams, touchIdProvider, translate) {
        this.profileProvider = profileProvider;
        this.logger = logger;
        this.walletProvider = walletProvider;
        this.externalLinkProvider = externalLinkProvider;
        this.configProvider = configProvider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.touchIdProvider = touchIdProvider;
        this.translate = translate;
        this.deleted = false;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad WalletSettingsPage');
    }
    ionViewWillEnter() {
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.walletName = this.wallet.name;
        this.canSign = this.wallet.canSign();
        this.needsBackup = this.wallet.needsBackup;
        this.hiddenBalance = this.wallet.balanceHidden;
        this.encryptEnabled = this.walletProvider.isEncrypted(this.wallet);
        this.touchIdProvider.isAvailable().then((isAvailable) => {
            this.touchIdAvailable = isAvailable;
        });
        this.config = this.configProvider.get();
        this.touchIdEnabled = this.config.touchIdFor
            ? this.config.touchIdFor[this.wallet.credentials.walletId]
            : null;
        this.touchIdPrevValue = this.touchIdEnabled;
        if (this.wallet.credentials &&
            !this.wallet.credentials.mnemonicEncrypted &&
            !this.wallet.credentials.mnemonic) {
            this.deleted = true;
        }
    }
    hiddenBalanceChange() {
        this.profileProvider.toggleHideBalanceFlag(this.wallet.credentials.walletId);
    }
    encryptChange() {
        if (!this.wallet)
            return;
        let val = this.encryptEnabled;
        if (val && !this.walletProvider.isEncrypted(this.wallet)) {
            this.logger.debug('Encrypting private key for', this.wallet.name);
            this.walletProvider
                .encrypt(this.wallet)
                .then(() => {
                this.profileProvider.updateCredentials(JSON.parse(this.wallet.export()));
                this.logger.debug('Wallet encrypted');
            })
                .catch(err => {
                this.logger.warn('Could not encrypt wallet', err);
                this.encryptEnabled = false;
            });
        }
        else if (!val && this.walletProvider.isEncrypted(this.wallet)) {
            this.walletProvider
                .decrypt(this.wallet)
                .then(() => {
                this.profileProvider.updateCredentials(JSON.parse(this.wallet.export()));
                this.logger.debug('Wallet decrypted');
            })
                .catch(err => {
                this.logger.warn('Could not decrypt wallet', err);
                this.encryptEnabled = true;
            });
        }
    }
    // **GCEdit: disabled on html yet for 1.0
    openSupportSpendingPassword() {
        let url = 'https://getcoins.com/faq';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('Read more in our support page');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    touchIdChange() {
        if (this.touchIdPrevValue == this.touchIdEnabled)
            return;
        let newStatus = this.touchIdEnabled;
        this.walletProvider
            .setTouchId(this.wallet, newStatus)
            .then(() => {
            this.touchIdPrevValue = this.touchIdEnabled;
            this.logger.debug('Touch Id status changed: ' + newStatus);
        })
            .catch(() => {
            this.touchIdEnabled = this.touchIdPrevValue;
        });
    }
    openAdvancedSettings() {
        this.navCtrl.push(WalletSettingsAdvancedPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    openWalletName() {
        this.navCtrl.push(WalletNamePage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    openWalletColor() {
        this.navCtrl.push(WalletColorPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
    openBackupSettings() {
        this.navCtrl.push(BackupWarningPage, {
            walletId: this.wallet.credentials.walletId
        });
    }
};
WalletSettingsPage = __decorate([
    Component({
        selector: 'page-wallet-settings',
        templateUrl: 'wallet-settings.html'
    }),
    __metadata("design:paramtypes", [ProfileProvider,
        Logger,
        WalletProvider,
        ExternalLinkProvider,
        ConfigProvider,
        NavController,
        NavParams,
        TouchIdProvider,
        TranslateService])
], WalletSettingsPage);
export { WalletSettingsPage };
//# sourceMappingURL=wallet-settings.js.map