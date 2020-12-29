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
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// Providers
import { ConfigProvider } from '../../../providers/config/config';
import { DerivationPathHelperProvider } from '../../../providers/derivation-path-helper/derivation-path-helper';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../../providers/popup/popup';
import { ProfileProvider } from '../../../providers/profile/profile';
import { PushNotificationsProvider } from '../../../providers/push-notifications/push-notifications';
import { WalletProvider } from '../../../providers/wallet/wallet';
import * as _ from 'lodash';
let ForgotpassPage = class ForgotpassPage {
    constructor(navCtrl, navParams, fb, profileProvider, configProvider, derivationPathHelperProvider, popupProvider, onGoingProcessProvider, logger, walletProvider, translate, events, pushNotificationsProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.fb = fb;
        this.profileProvider = profileProvider;
        this.configProvider = configProvider;
        this.derivationPathHelperProvider = derivationPathHelperProvider;
        this.popupProvider = popupProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.logger = logger;
        this.walletProvider = walletProvider;
        this.translate = translate;
        this.events = events;
        this.pushNotificationsProvider = pushNotificationsProvider;
        this.phone = true;
        this.otp = false;
        this.Register = "Proceed";
        this.okText = this.translate.instant('Ok');
        this.cancelText = this.translate.instant('Cancel');
        this.isShared = this.navParams.get('isShared');
        this.title = this.isShared
            ? this.translate.instant('Sell Properties')
            : this.translate.instant('Sell Property');
        this.defaults = this.configProvider.getDefaults();
        this.tc = this.isShared ? this.defaults.wallet.totalCopayers : 1;
        this.copayers = _.range(2, this.defaults.limits.totalCopayers + 1);
        this.derivationPathByDefault = this.derivationPathHelperProvider.default;
        this.derivationPathForTestnet = this.derivationPathHelperProvider.defaultTestnet;
        this.showAdvOpts = false;
        this.createForm = this.fb.group({
            phone: [null],
            pin: [null],
            otp: [null]
        });
    }
    ngOnInit() {
    }
    Proceed() {
        // make api request
        this.phone = false;
        this.otp = true;
        this.Register = "Reset Password";
    }
};
ForgotpassPage = __decorate([
    Component({
        selector: 'page-forgotpass',
        templateUrl: 'forgotpass.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        FormBuilder,
        ProfileProvider,
        ConfigProvider,
        DerivationPathHelperProvider,
        PopupProvider,
        OnGoingProcessProvider,
        Logger,
        WalletProvider,
        TranslateService,
        Events,
        PushNotificationsProvider])
], ForgotpassPage);
export { ForgotpassPage };
//# sourceMappingURL=forgotpass.js.map