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
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../../../providers/logger/logger';
// native
import { SplashScreen } from '@ionic-native/splash-screen';
// providers
import { AppProvider } from '../../../../../providers/app/app';
import { ConfigProvider } from '../../../../../providers/config/config';
import { PersistenceProvider } from '../../../../../providers/persistence/persistence';
import { PlatformProvider } from '../../../../../providers/platform/platform';
import { ProfileProvider } from '../../../../../providers/profile/profile';
import { ReplaceParametersProvider } from '../../../../../providers/replace-parameters/replace-parameters';
let WalletServiceUrlPage = class WalletServiceUrlPage {
    constructor(profileProvider, navCtrl, navParams, configProvider, app, logger, persistenceProvider, formBuilder, events, splashScreen, platformProvider, replaceParametersProvider, translate) {
        this.profileProvider = profileProvider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.configProvider = configProvider;
        this.app = app;
        this.logger = logger;
        this.persistenceProvider = persistenceProvider;
        this.formBuilder = formBuilder;
        this.events = events;
        this.splashScreen = splashScreen;
        this.platformProvider = platformProvider;
        this.replaceParametersProvider = replaceParametersProvider;
        this.translate = translate;
        this.success = false;
        this.walletServiceForm = this.formBuilder.group({
            bwsurl: [
                '',
                Validators.compose([Validators.minLength(1), Validators.required])
            ]
        });
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad WalletServiceUrlPage');
    }
    ionViewWillEnter() {
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.defaults = this.configProvider.getDefaults();
        this.config = this.configProvider.get();
        let appName = this.app.info.nameCase;
        this.comment = this.replaceParametersProvider.replace(this.translate.instant("{{appName}} depends on Bitcore Wallet Service (BWS) for blockchain information, networking and Copayer synchronization. The default configuration points to https://bws.bitpay.com (BitPay's public BWS instance)."), { appName });
        this.walletServiceForm.value.bwsurl =
            (this.config.bwsFor &&
                this.config.bwsFor[this.wallet.credentials.walletId]) ||
                this.defaults.bws.url;
    }
    resetDefaultUrl() {
        this.walletServiceForm.value.bwsurl = this.defaults.bws.url;
    }
    save() {
        let bws;
        switch (this.walletServiceForm.value.bwsurl) {
            case 'prod':
            case 'production':
                bws = 'https://bws.bitpay.com/bws/api';
                break;
            case 'sta':
            case 'staging':
                bws = 'https://bws-staging.b-pay.net/bws/api';
                break;
            case 'loc':
            case 'local':
                bws = 'http://localhost:3232/bws/api';
                break;
        }
        if (bws) {
            this.logger.info('Using BWS URL Alias to ' + bws);
            this.walletServiceForm.value.bwsurl = bws;
        }
        let opts = {
            bwsFor: {}
        };
        opts.bwsFor[this.wallet.credentials.walletId] = this.walletServiceForm.value.bwsurl;
        this.configProvider.set(opts);
        this.persistenceProvider.setCleanAndScanAddresses(this.wallet.credentials.walletId);
        this.events.publish('wallet:updated', this.wallet.credentials.walletId);
        this.navCtrl.popToRoot({ animate: false }).then(() => {
            this.navCtrl.parent.select(0);
            this.reload();
        });
    }
    reload() {
        window.location.reload();
        if (this.platformProvider.isCordova)
            this.splashScreen.show();
    }
};
WalletServiceUrlPage = __decorate([
    Component({
        selector: 'page-wallet-service-url',
        templateUrl: 'wallet-service-url.html'
    }),
    __metadata("design:paramtypes", [ProfileProvider,
        NavController,
        NavParams,
        ConfigProvider,
        AppProvider,
        Logger,
        PersistenceProvider,
        FormBuilder,
        Events,
        SplashScreen,
        PlatformProvider,
        ReplaceParametersProvider,
        TranslateService])
], WalletServiceUrlPage);
export { WalletServiceUrlPage };
//# sourceMappingURL=wallet-service-url.js.map