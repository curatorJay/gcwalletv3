var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { App, Events, ModalController, NavController, Platform } from 'ionic-angular';
// providers
// import { AmazonProvider } from '../providers/amazon/amazon';  // **GCedit
import { AppProvider } from '../providers/app/app';
// import { BitPayCardProvider } from '../providers/bitpay-card/bitpay-card';  // **GCedit
// import { CoinbaseProvider } from '../providers/coinbase/coinbase';  // **GCedit
import { ConfigProvider } from '../providers/config/config';
import { EmailNotificationsProvider } from '../providers/email-notifications/email-notifications';
// import { GlideraProvider } from '../providers/glidera/glidera';
import { IncomingDataProvider } from '../providers/incoming-data/incoming-data';
import { Logger } from '../providers/logger/logger';
// import { MercadoLibreProvider } from '../providers/mercado-libre/mercado-libre';  // **GCedit
import { PopupProvider } from '../providers/popup/popup';
import { ProfileProvider } from '../providers/profile/profile';
import { PushNotificationsProvider } from '../providers/push-notifications/push-notifications';
// import { ShapeshiftProvider } from '../providers/shapeshift/shapeshift';  // **GCedit
import { TouchIdProvider } from '../providers/touchid/touchid';
// pages
import { CopayersPage } from '../pages/add/copayers/copayers';
import { ImportWalletPage } from '../pages/add/import-wallet/import-wallet';
import { JoinWalletPage } from '../pages/add/join-wallet/join-wallet';
import { FingerprintModalPage } from '../pages/fingerprint/fingerprint';
import { BitPayCardIntroPage } from '../pages/integrations/bitpay-card/bitpay-card-intro/bitpay-card-intro';
// import { CoinbasePage } from '../pages/integrations/coinbase/coinbase';  // **GCedit
// import { GlideraPage } from '../pages/integrations/glidera/glidera'; // **GCedit
import { DisclaimerPage } from '../pages/onboarding/disclaimer/disclaimer';
import { OnboardingPage } from '../pages/onboarding/onboarding';
import { PaperWalletPage } from '../pages/paper-wallet/paper-wallet';
import { PinModalPage } from '../pages/pin/pin-modal/pin-modal';
import { AmountPage } from '../pages/send/amount/amount';
import { ConfirmPage } from '../pages/send/confirm/confirm';
import { AddressbookAddPage } from '../pages/settings/addressbook/add/add';
import { TabsPage } from '../pages/tabs/tabs';
import { WalletDetailsPage } from '../pages/wallet-details/wallet-details';
// As the handleOpenURL handler kicks in before the App is started,
// declare the handler function at the top of app.component.ts (outside the class definition)
// to track the passed Url
window.handleOpenURL = (url) => {
    window.handleOpenURL_LastURL = url;
};
let GCApp = class GCApp {
    constructor(platform, statusBar, splashScreen, events, logger, appProvider, profile, configProvider, modalCtrl, 
    // **GCedit
    // private glideraProvider: GlideraProvider,
    // private coinbaseProvider: CoinbaseProvider,
    // private amazonProvider: AmazonProvider,
    // private bitPayCardProvider: BitPayCardProvider,
    // private mercadoLibreProvider: MercadoLibreProvider,
    // private shapeshiftProvider: ShapeshiftProvider,
    emailNotificationsProvider, screenOrientation, popupProvider, pushNotificationsProvider, app, incomingDataProvider) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.events = events;
        this.logger = logger;
        this.appProvider = appProvider;
        this.profile = profile;
        this.configProvider = configProvider;
        this.modalCtrl = modalCtrl;
        this.emailNotificationsProvider = emailNotificationsProvider;
        this.screenOrientation = screenOrientation;
        this.popupProvider = popupProvider;
        this.pushNotificationsProvider = pushNotificationsProvider;
        this.app = app;
        this.incomingDataProvider = incomingDataProvider;
        this.pageMap = {
            AddressbookAddPage,
            AmountPage,
            BitPayCardIntroPage,
            // CoinbasePage,
            ConfirmPage,
            CopayersPage,
            // GlideraPage,
            ImportWalletPage,
            JoinWalletPage,
            PaperWalletPage,
            WalletDetailsPage
        };
        this.initializeApp();
    }
    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }
    initializeApp() {
        this.platform
            .ready()
            .then(readySource => {
            this.onPlatformReady(readySource);
        })
            .catch(e => {
            this.logger.error('Platform is not ready.', e);
        });
    }
    onPlatformReady(readySource) {
        this.appProvider
            .load()
            .then(() => {
            this.onAppLoad(readySource);
        })
            .catch(err => {
            let title = 'Could not initialize the app';
            let message = JSON.stringify(err);
            this.popupProvider.ionicAlert(title, message);
        });
    }
    onAppLoad(readySource) {
        this.logger.info('Platform ready (' +
            readySource +
            '): ' +
            this.appProvider.info.nameCase +
            ' - v' +
            this.appProvider.info.version +
            ' #' +
            this.appProvider.info.commitHash);
        if (this.platform.is('cordova')) {
            this.statusBar.show();
            // Set to portrait
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
            // Only overlay for iOS
            if (this.platform.is('ios'))
                this.statusBar.overlaysWebView(true);
            this.statusBar.styleLightContent();
            this.splashScreen.hide();
            // Subscribe Resume
            this.onResumeSubscription = this.platform.resume.subscribe(() => {
                // Update Wallet Status
                this.events.publish('status:updated');
                // Check PIN or Fingerprint on Resume
                this.openLockModal();
            });
            // Check PIN or Fingerprint
            this.openLockModal();
        }
        // this.registerIntegrations(); // **GCedit
        this.incomingDataRedirEvent();
        // Check Profile
        this.profile
            .loadAndBindProfile()
            .then(profile => {
            this.onProfileLoad(profile);
        })
            .catch((err) => {
            this.logger.warn('LoadAndBindProfile', err.message);
            this.rootPage =
                err.message == 'ONBOARDINGNONCOMPLETED: Onboarding non completed'
                    ? OnboardingPage
                    : DisclaimerPage;
        });
    }
    onProfileLoad(profile) {
        this.emailNotificationsProvider.init(); // Update email subscription if necessary
        this.initPushNotifications();
        if (profile) {
            this.logger.info('Profile exists.');
            this.rootPage = TabsPage;
            if (this.platform.is('cordova')) {
                this.handleDeepLinks();
            }
            if (this.isNodeWebkit()) {
                this.handleDeepLinksNW();
            }
        }
        else {
            this.logger.info('No profile exists.');
            this.profile.createProfile();
            this.rootPage = OnboardingPage;
        }
    }
    openLockModal() {
        if (this.isModalOpen)
            return;
        let config = this.configProvider.get();
        let lockMethod = config && config.lock && config.lock.method
            ? config.lock.method.toLowerCase()
            : null;
        if (!lockMethod)
            return;
        if (lockMethod == 'pin')
            this.openPINModal('checkPin');
        if (lockMethod == 'fingerprint')
            this.openFingerprintModal();
    }
    openPINModal(action) {
        this.isModalOpen = true;
        const modal = this.modalCtrl.create(PinModalPage, { action }, { cssClass: 'fullscreen-modal' });
        modal.present({ animate: false });
        modal.onDidDismiss(() => {
            this.isModalOpen = false;
        });
    }
    openFingerprintModal() {
        this.isModalOpen = true;
        const modal = this.modalCtrl.create(FingerprintModalPage, {}, { cssClass: 'fullscreen-modal' });
        modal.present({ animate: false });
        modal.onDidDismiss(() => {
            this.isModalOpen = false;
        });
    }
    /*  // **GCedit
      private registerIntegrations(): void {
        // Mercado Libre
        if (this.appProvider.info._enabledExtensions.mercadolibre)
          this.mercadoLibreProvider.register();
    
        // Amazon Gift Cards
        if (this.appProvider.info._enabledExtensions.amazon)
          this.amazonProvider.register();
    
        // ShapeShift
        if (this.appProvider.info._enabledExtensions.shapeshift)
          this.shapeshiftProvider.register();
    
        // Glidera
        if (this.appProvider.info._enabledExtensions.glidera) {
          this.glideraProvider.setCredentials();
          this.glideraProvider.register();
        }
    
        // Coinbase
        if (this.appProvider.info._enabledExtensions.coinbase) {
          this.coinbaseProvider.setCredentials();
          this.coinbaseProvider.register();
        }
    
        // BitPay Card
        if (this.appProvider.info._enabledExtensions.debitcard)
          this.bitPayCardProvider.register();
      }
      */
    incomingDataRedirEvent() {
        this.events.subscribe('IncomingDataRedir', nextView => {
            const tabNav = this.getSelectedTabNav();
            tabNav.push(this.pageMap[nextView.name], nextView.params);
        });
    }
    initPushNotifications() {
        this.events.subscribe('OpenWalletEvent', nextView => {
            this.app.getRootNavs()[0].setRoot(TabsPage);
            this.nav.push(this.pageMap[nextView.name], nextView.params);
        });
        this.pushNotificationsProvider.init();
    }
    handleDeepLinks() {
        // Check if app was resume by custom url scheme
        window.handleOpenURL = (url) => {
            this.logger.info('App was resumed by custom url scheme');
            this.handleOpenUrl(url);
        };
        // Check if app was opened by custom url scheme
        const lastUrl = window.handleOpenURL_LastURL || '';
        if (lastUrl && lastUrl !== '') {
            delete window.handleOpenURL_LastURL;
            setTimeout(() => {
                this.logger.info('App was opened by custom url scheme');
                this.handleOpenUrl(lastUrl);
            }, 0);
        }
    }
    handleOpenUrl(url) {
        if (!this.incomingDataProvider.redir(url)) {
            this.logger.warn('Unknown URL! : ' + url);
        }
    }
    handleDeepLinksNW() {
        var gui = window.require('nw.gui');
        // This event is sent to an existent instance of GetCoins (only for standalone apps)
        gui.App.on('open', this.onOpenNW.bind(this));
        // Used at the startup of GetCoins
        var argv = gui.App.argv;
        if (argv && argv[0] && !window._urlHandled) {
            window._urlHandled = true;
            this.handleOpenUrl(argv[0]);
        }
    }
    onOpenNW(pathData) {
        if (pathData.indexOf('bitcoincash:/') != -1) {
            this.logger.debug('Bitcoin Cash URL found');
            this.handleOpenUrl(pathData.substring(pathData.indexOf('bitcoincash:/')));
        }
        else if (pathData.indexOf('bitcoin:/') != -1) {
            this.logger.debug('Bitcoin URL found');
            this.handleOpenUrl(pathData.substring(pathData.indexOf('bitcoin:/')));
        }
        else if (pathData.indexOf(this.appProvider.info.name + '://') != -1) {
            this.logger.debug(this.appProvider.info.name + ' URL found');
            this.handleOpenUrl(pathData.substring(pathData.indexOf(this.appProvider.info.name + '://')));
        }
        else {
            this.logger.debug('URL found');
            this.handleOpenUrl(pathData);
        }
    }
    isNodeWebkit() {
        let isNode = typeof process !== 'undefined' && typeof require !== 'undefined';
        if (isNode) {
            try {
                return typeof window.require('nw.gui') !== 'undefined';
            }
            catch (e) {
                return false;
            }
        }
        return false;
    }
    getSelectedTabNav() {
        return this.nav
            .getActiveChildNavs()[0]
            .viewCtrl.instance.tabs.getSelected();
    }
};
__decorate([
    ViewChild('appNav'),
    __metadata("design:type", NavController)
], GCApp.prototype, "nav", void 0);
GCApp = __decorate([
    Component({
        templateUrl: 'app.html',
        providers: [TouchIdProvider]
    }),
    __metadata("design:paramtypes", [Platform,
        StatusBar,
        SplashScreen,
        Events,
        Logger,
        AppProvider,
        ProfileProvider,
        ConfigProvider,
        ModalController,
        EmailNotificationsProvider,
        ScreenOrientation,
        PopupProvider,
        PushNotificationsProvider,
        App,
        IncomingDataProvider])
], GCApp);
export { GCApp };
//# sourceMappingURL=app.component.js.map