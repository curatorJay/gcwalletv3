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
import { AlertController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// native
import { SocialSharing } from '@ionic-native/social-sharing';
// providers
import { AppProvider } from '../../../providers/app/app';
import { ConfigProvider } from '../../../providers/config/config';
import { PersistenceProvider } from '../../../providers/persistence/persistence';
import { PlatformProvider } from '../../../providers/platform/platform';
import { ReplaceParametersProvider } from '../../../providers/replace-parameters/replace-parameters';
let FeedbackCompletePage = class FeedbackCompletePage {
    constructor(navCtrl, navParams, viewCtrl, logger, alertCtrl, platformProvider, persistenceProvider, socialSharing, appProvider, configProvider, replaceParametersProvider, translate) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.logger = logger;
        this.alertCtrl = alertCtrl;
        this.platformProvider = platformProvider;
        this.persistenceProvider = persistenceProvider;
        this.socialSharing = socialSharing;
        this.appProvider = appProvider;
        this.configProvider = configProvider;
        this.replaceParametersProvider = replaceParametersProvider;
        this.translate = translate;
        this.score = this.navParams.data.score;
        this.skipped = this.navParams.data.skipped;
        this.rated = this.navParams.data.rated;
        this.fromSettings = this.navParams.data.fromSettings;
        this.isCordova = this.platformProvider.isCordova;
        this.title = this.replaceParametersProvider.replace(this.translate.instant('Share {{appName}}'), { appName: this.appProvider.info.nameCase });
        let defaults = this.configProvider.getDefaults();
        this.downloadUrl =
            this.appProvider.info.name == 'getcoins'
                ? defaults.download.getcoins.url
                : defaults.download.getcoins.url;
    }
    ionViewWillLeave() {
        if (!this.fromSettings) {
            this.navCtrl.swipeBackEnabled = true;
        }
    }
    ionViewWillEnter() {
        if (!this.fromSettings) {
            this.viewCtrl.showBackButton(false);
            this.navCtrl.swipeBackEnabled = false;
        }
        this.persistenceProvider.getFeedbackInfo().then(info => {
            let feedbackInfo = info;
            feedbackInfo.sent = true;
            this.persistenceProvider.setFeedbackInfo(feedbackInfo);
        });
        if (!this.isCordova)
            return;
        this.socialSharing
            .canShareVia('com.apple.social.facebook', 'msg', null, null, null)
            .then(() => {
            this.shareFacebookVia = 'com.apple.social.facebook';
            this.facebook = true;
        })
            .catch(() => {
            this.socialSharing
                .canShareVia('com.facebook.katana', 'msg', null, null, null)
                .then(() => {
                this.shareFacebookVia = 'com.facebook.katana';
                this.facebook = true;
            })
                .catch(e => {
                this.logger.debug('facebook error: ' + e);
                this.facebook = false;
            });
        });
        this.socialSharing
            .canShareVia('com.apple.social.twitter', 'msg', null, null, null)
            .then(() => {
            this.shareTwitterVia = 'com.apple.social.twitter';
            this.twitter = true;
        })
            .catch(() => {
            this.socialSharing
                .canShareVia('com.twitter.android', 'msg', null, null, null)
                .then(() => {
                this.shareTwitterVia = 'com.twitter.android';
                this.twitter = true;
            })
                .catch(e => {
                this.logger.debug('twitter error: ' + e);
                this.twitter = false;
            });
        });
        this.socialSharing
            .canShareVia('whatsapp', 'msg', null, null, null)
            .then(() => {
            this.whatsapp = true;
        })
            .catch(e => {
            this.logger.debug('whatsapp error: ' + e);
            this.whatsapp = false;
        });
    }
    shareFacebook() {
        // **GC Edit
        if (this.facebook) {
            this.socialSharing.shareVia(this.shareFacebookVia, null, null, null, this.downloadUrl);
        }
        else {
            let alert = this.alertCtrl.create({
                title: 'Oops, Not Found',
                subTitle: 'This app is not available for your device.',
                buttons: ['Okay']
            });
            alert.present();
        }
    }
    shareTwitter() {
        // **GC Edit
        if (this.twitter) {
            this.socialSharing.shareVia(this.shareTwitterVia, null, null, null, this.downloadUrl);
        }
        else {
            let alert = this.alertCtrl.create({
                title: 'Oops, Not Found',
                subTitle: 'This app is not available for your device.',
                buttons: ['Okay']
            });
            alert.present();
        }
    }
    shareWhatsapp() {
        // **GC Edit
        if (this.whatsapp) {
            this.socialSharing.shareViaWhatsApp(this.downloadUrl);
        }
        else {
            let alert = this.alertCtrl.create({
                title: 'Oops, Not Found',
                subTitle: 'This app is not available for your device.',
                buttons: ['Okay']
            });
            alert.present();
        }
    }
    close() {
        this.navCtrl.popToRoot({ animate: false });
    }
};
FeedbackCompletePage = __decorate([
    Component({
        selector: 'page-feedback-complete',
        templateUrl: 'feedback-complete.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        ViewController,
        Logger,
        AlertController,
        PlatformProvider,
        PersistenceProvider,
        SocialSharing,
        AppProvider,
        ConfigProvider,
        ReplaceParametersProvider,
        TranslateService])
], FeedbackCompletePage);
export { FeedbackCompletePage };
//# sourceMappingURL=feedback-complete.js.map