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
import { ModalController, NavController } from 'ionic-angular';
import { Logger } from '../../providers/logger/logger';
import * as _ from 'lodash';
// providers
import { AppProvider } from '../../providers/app/app';
import { BitPayCardProvider } from '../../providers/bitpay-card/bitpay-card';
import { ConfigProvider } from '../../providers/config/config';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { HomeIntegrationsProvider } from '../../providers/home-integrations/home-integrations';
import { LanguageProvider } from '../../providers/language/language';
import { PlatformProvider } from '../../providers/platform/platform';
import { ProfileProvider } from '../../providers/profile/profile';
import { TouchIdProvider } from '../../providers/touchid/touchid';
// pages
import { FeedbackCompletePage } from '../feedback/feedback-complete/feedback-complete';
import { SendFeedbackPage } from '../feedback/send-feedback/send-feedback';
import { AmazonSettingsPage } from '../integrations/amazon/amazon-settings/amazon-settings';
import { BitPaySettingsPage } from '../integrations/bitpay-card/bitpay-settings/bitpay-settings';
import { CoinbaseSettingsPage } from '../integrations/coinbase/coinbase-settings/coinbase-settings';
import { GlideraSettingsPage } from '../integrations/glidera/glidera-settings/glidera-settings';
import { MercadoLibreSettingsPage } from '../integrations/mercado-libre/mercado-libre-settings/mercado-libre-settings';
import { ShapeshiftSettingsPage } from '../integrations/shapeshift/shapeshift-settings/shapeshift-settings';
import { PinModalPage } from '../pin/pin-modal/pin-modal';
import { AboutPage } from './about/about';
import { AddressbookPage } from './addressbook/addressbook';
import { AdvancedPage } from './advanced/advanced';
import { AltCurrencyPage } from './alt-currency/alt-currency';
import { FeePolicyPage } from './fee-policy/fee-policy';
import { LanguagePage } from './language/language';
import { LockPage } from './lock/lock';
import { NotificationsPage } from './notifications/notifications';
import { WalletSettingsPage } from './wallet-settings/wallet-settings';
import { ScanPage } from '../scan/scan';
let SettingsPage = class SettingsPage {
    constructor(navCtrl, app, language, externalLinkProvider, profileProvider, configProvider, logger, homeIntegrationsProvider, bitPayCardProvider, platformProvider, translate, modalCtrl, touchid) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.language = language;
        this.externalLinkProvider = externalLinkProvider;
        this.profileProvider = profileProvider;
        this.configProvider = configProvider;
        this.logger = logger;
        this.homeIntegrationsProvider = homeIntegrationsProvider;
        this.bitPayCardProvider = bitPayCardProvider;
        this.platformProvider = platformProvider;
        this.translate = translate;
        this.modalCtrl = modalCtrl;
        this.touchid = touchid;
        this.integrationServices = [];
        this.bitpayCardItems = [];
        this.showBitPayCard = false;
        this.appName = this.app.info.nameCase;
        this.walletsBch = [];
        this.walletsBtc = [];
        this.isCordova = this.platformProvider.isCordova;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad SettingsPage');
    }
    ionViewWillEnter() {
        this.currentLanguageName = this.language.getName(this.language.getCurrent());
        this.walletsBtc = this.profileProvider.getWallets({
            coin: 'btc'
        });
        this.walletsBch = this.profileProvider.getWallets({
            coin: 'bch'
        });
        this.config = this.configProvider.get();
        this.selectedAlternative = {
            name: this.config.wallet.settings.alternativeName,
            isoCode: this.config.wallet.settings.alternativeIsoCode
        };
        this.lockMethod =
            this.config && this.config.lock && this.config.lock.method
                ? this.config.lock.method.toLowerCase()
                : null;
    }
    ionViewDidEnter() {
        // Show integrations
        let integrations = this.homeIntegrationsProvider.get();
        // Hide BitPay if linked
        setTimeout(() => {
            this.integrationServices = _.remove(_.clone(integrations), x => {
                if (x.name == 'debitcard' && x.linked)
                    return;
                else
                    return x;
            });
        }, 200);
        // Only BitPay Wallet
        this.bitPayCardProvider.get({}, (_, cards) => {
            this.showBitPayCard = this.app.info._enabledExtensions.debitcard
                ? true
                : false;
            this.bitpayCardItems = cards;
        });
    }
    openAltCurrencyPage() {
        this.navCtrl.push(AltCurrencyPage);
    }
    openLanguagePage() {
        this.navCtrl.push(LanguagePage);
    }
    openAdvancedPage() {
        this.navCtrl.push(AdvancedPage);
    }
    openAboutPage() {
        this.navCtrl.push(AboutPage);
    }
    openLockPage() {
        let config = this.configProvider.get();
        let lockMethod = config && config.lock && config.lock.method
            ? config.lock.method.toLowerCase()
            : null;
        if (!lockMethod || lockMethod == 'disabled')
            this.navCtrl.push(LockPage);
        if (lockMethod == 'pin')
            this.openPinModal('lockSetUp');
        if (lockMethod == 'fingerprint')
            this.checkFingerprint();
    }
    openAddressBookPage() {
        this.navCtrl.push(AddressbookPage);
    }
    openNotificationsPage() {
        this.navCtrl.push(NotificationsPage);
    }
    openFeePolicyPage() {
        this.navCtrl.push(FeePolicyPage);
    }
    openWalletSettingsPage(walletId) {
        this.navCtrl.push(WalletSettingsPage, { walletId });
    }
    openSendFeedbackPage() {
        this.navCtrl.push(SendFeedbackPage);
    }
    openFeedbackCompletePage() {
        this.navCtrl.push(FeedbackCompletePage, { fromSettings: true });
    }
    openSettingIntegration(name) {
        switch (name) {
            case 'coinbase':
                this.navCtrl.push(CoinbaseSettingsPage);
                break;
            case 'glidera':
                this.navCtrl.push(GlideraSettingsPage);
                break;
            case 'debitcard':
                this.navCtrl.push(BitPaySettingsPage);
                break;
            case 'amazon':
                this.navCtrl.push(AmazonSettingsPage);
                break;
            case 'mercadolibre':
                this.navCtrl.push(MercadoLibreSettingsPage);
                break;
            case 'shapeshift':
                this.navCtrl.push(ShapeshiftSettingsPage);
                break;
        }
    }
    openCardSettings(id) {
        this.navCtrl.push(BitPaySettingsPage, { id });
    }
    openScanPage() {
        this.navCtrl.push(ScanPage);
    }
    openHelpExternalLink() {
        let url = this.appName == 'GetCoins'
            ? 'https://getcoins.com/faq'
            : 'https://github.com/getcoinscom/gcwallet/issues';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('Help and support information is available at the website.');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    openPinModal(action) {
        const modal = this.modalCtrl.create(PinModalPage, { action }, { cssClass: 'fullscreen-modal' });
        modal.present();
        modal.onDidDismiss(cancelClicked => {
            if (!cancelClicked)
                this.navCtrl.push(LockPage);
        });
    }
    checkFingerprint() {
        this.touchid.check().then(() => {
            this.navCtrl.push(LockPage);
        });
    }
};
SettingsPage = __decorate([
    Component({
        selector: 'page-settings',
        templateUrl: 'settings.html'
    }),
    __metadata("design:paramtypes", [NavController,
        AppProvider,
        LanguageProvider,
        ExternalLinkProvider,
        ProfileProvider,
        ConfigProvider,
        Logger,
        HomeIntegrationsProvider,
        BitPayCardProvider,
        PlatformProvider,
        TranslateService,
        ModalController,
        TouchIdProvider])
], SettingsPage);
export { SettingsPage };
//# sourceMappingURL=settings.js.map