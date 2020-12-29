var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AddressBookProvider, AddressProvider, 
// AmazonProvider,
AndroidFingerprintAuth, AppIdentityProvider, AppProvider, BackupProvider, 
// **GCEdit: YOU CANNOT TAKE OUT THESE TWO BitPay providers because it will cause the home page to be completly blank.
BitPayCardProvider, BitPayProvider, 
// BitPayAccountProvider, // **GCEdit: THis one was okay to take out.
BwcErrorProvider, BwcProvider, Clipboard, 
// CoinbaseProvider,
ConfigProvider, DerivationPathHelperProvider, Device, EmailNotificationsProvider, ExternalLinkProvider, FCM, FeedbackProvider, FeeProvider, File, FilterProvider, 
// GlideraProvider,
HomeIntegrationsProvider, IncomingDataProvider, LanguageProvider, Logger, 
// MercadoLibreProvider,
NodeWebkitProvider, OnGoingProcessProvider, PayproProvider, PersistenceProvider, PlatformProvider, PopupProvider, ProfileProvider, PushNotificationsProvider, QRScanner, RateProvider, ReleaseProvider, ReplaceParametersProvider, ScanProvider, ScreenOrientation, 
// ShapeshiftProvider,
SocialSharing, SplashScreen, StatusBar, TimeProvider, Toast, TouchID, TouchIdProvider, TxConfirmNotificationProvider, TxFormatProvider, Vibration, WalletProvider } from './index';
import { InAppBrowser } from '@ionic-native/in-app-browser';
let ProvidersModule = class ProvidersModule {
};
ProvidersModule = __decorate([
    NgModule({
        providers: [
            AddressProvider,
            AddressBookProvider,
            AndroidFingerprintAuth,
            AppProvider,
            AppIdentityProvider,
            // AmazonProvider,
            BackupProvider,
            BitPayProvider,
            BitPayCardProvider,
            // BitPayAccountProvider,
            BwcProvider,
            BwcErrorProvider,
            ConfigProvider,
            // CoinbaseProvider,
            Clipboard,
            DerivationPathHelperProvider,
            Device,
            ExternalLinkProvider,
            FeedbackProvider,
            FCM,
            HomeIntegrationsProvider,
            FeeProvider,
            // GlideraProvider,
            InAppBrowser,
            IncomingDataProvider,
            LanguageProvider,
            Logger,
            { provide: 'console', useValue: console },
            // MercadoLibreProvider,
            NodeWebkitProvider,
            OnGoingProcessProvider,
            PayproProvider,
            PlatformProvider,
            ProfileProvider,
            PopupProvider,
            QRScanner,
            PushNotificationsProvider,
            RateProvider,
            ReleaseProvider,
            ReplaceParametersProvider,
            // ShapeshiftProvider,
            StatusBar,
            SplashScreen,
            ScanProvider,
            ScreenOrientation,
            SocialSharing,
            Toast,
            TouchID,
            Vibration,
            TimeProvider,
            TouchIdProvider,
            TxConfirmNotificationProvider,
            FilterProvider,
            TxFormatProvider,
            WalletProvider,
            EmailNotificationsProvider,
            DecimalPipe,
            PersistenceProvider,
            File
        ]
    })
], ProvidersModule);
export { ProvidersModule };
//# sourceMappingURL=providers.module.js.map