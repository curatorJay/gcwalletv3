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
// native
import { Device } from '@ionic-native/device';
// providers
import { AppProvider } from '../../../providers/app/app';
import { ConfigProvider } from '../../../providers/config/config';
import { ExternalLinkProvider } from '../../../providers/external-link/external-link';
import { FeedbackProvider } from '../../../providers/feedback/feedback';
import { PlatformProvider } from '../../../providers/platform/platform';
import { ReplaceParametersProvider } from '../../../providers/replace-parameters/replace-parameters';
// pages
import { FeedbackCompletePage } from '../feedback-complete/feedback-complete';
import { SendFeedbackPage } from '../send-feedback/send-feedback';
import * as _ from 'lodash';
let FeedbackPage = class FeedbackPage {
    constructor(platformProvider, appProvider, configProvider, navParams, feedbackProvider, navCtrl, logger, externalLinkProvider, device, replaceParametersProvider, translate) {
        this.platformProvider = platformProvider;
        this.appProvider = appProvider;
        this.configProvider = configProvider;
        this.navParams = navParams;
        this.feedbackProvider = feedbackProvider;
        this.navCtrl = navCtrl;
        this.logger = logger;
        this.externalLinkProvider = externalLinkProvider;
        this.device = device;
        this.replaceParametersProvider = replaceParametersProvider;
        this.translate = translate;
        this.score = this.navParams.data.score;
        this.isAndroid = this.platformProvider.isAndroid;
        this.isIOS = this.platformProvider.isIOS;
        this.config = this.configProvider.get();
        this.appName = this.appProvider.info.nameCase;
        this.subtitle = this.replaceParametersProvider.replace(this.translate.instant('5-star ratings help us get {{appName}} into more hands, and more users means more resources can be committed to the app!'), { appName: this.appName });
        this.subsubtitle = this.replaceParametersProvider.replace(this.translate.instant('Would you be willing to rate {{appName}} in the app store?'), { appName: this.appName });
    }
    skip() {
        this.navCtrl.push(FeedbackCompletePage, {
            score: this.score,
            skipped: true
        });
        let platform = this.device.platform || 'Unknown platform';
        let version = this.device.version || 'Unknown version';
        let dataSrc = {
            email: _.values(this.config.emailFor)[0] || ' ',
            feedback: ' ',
            score: this.score,
            appVersion: this.appProvider.info.version,
            platform,
            deviceVersion: version
        };
        this.feedbackProvider.send(dataSrc).catch(() => {
            this.logger.warn('Could not send feedback.');
        });
    }
    sendFeedback() {
        this.navCtrl.push(SendFeedbackPage, { score: this.score });
    }
    goAppStore() {
        let defaults = this.configProvider.getDefaults();
        let url;
        if (this.isAndroid)
            url = defaults.rateApp.getcoins.android;
        // this.appName == 'GetCoins'
        //   ? defaults.rateApp.getcoins.android
        //   : defaults.rateApp.getcoins.android;
        if (this.isIOS)
            url = defaults.rateApp.getcoins.ios;
        // this.appName == 'GetCoins'
        //   ? defaults.rateApp.getcoins.ios
        //   : defaults.rateApp.getcoins.ios;
        this.externalLinkProvider.open(url);
        this.navCtrl.push(FeedbackCompletePage, {
            score: this.score,
            skipped: true,
            rated: true
        });
    }
};
FeedbackPage = __decorate([
    Component({
        selector: 'page-feedback',
        templateUrl: 'feedback.html'
    }),
    __metadata("design:paramtypes", [PlatformProvider,
        AppProvider,
        ConfigProvider,
        NavParams,
        FeedbackProvider,
        NavController,
        Logger,
        ExternalLinkProvider,
        Device,
        ReplaceParametersProvider,
        TranslateService])
], FeedbackPage);
export { FeedbackPage };
//# sourceMappingURL=feedback.js.map