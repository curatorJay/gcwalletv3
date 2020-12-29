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
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Navbar, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
// native
import { Device } from '@ionic-native/device';
// providers
import { AppProvider } from '../../../providers/app/app';
import { ConfigProvider } from '../../../providers/config/config';
import { FeedbackProvider } from '../../../providers/feedback/feedback';
// import { Logger } from '../../../providers/logger/logger';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PersistenceProvider } from '../../../providers/persistence/persistence';
import { PopupProvider } from '../../../providers/popup/popup';
import { ReplaceParametersProvider } from '../../../providers/replace-parameters/replace-parameters';
// pages
import { FeedbackCompletePage } from '../feedback-complete/feedback-complete';
let SendFeedbackPage = class SendFeedbackPage {
    constructor(configProvider, navCtrl, navParams, appProvider, onGoingProcessProvider, feedbackProvider, formBuilder, 
    // private logger: Logger,
    persistenceProvider, popupProvider, translate, device, replaceParametersProvider) {
        this.configProvider = configProvider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.appProvider = appProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.feedbackProvider = feedbackProvider;
        this.formBuilder = formBuilder;
        this.persistenceProvider = persistenceProvider;
        this.popupProvider = popupProvider;
        this.translate = translate;
        this.device = device;
        this.replaceParametersProvider = replaceParametersProvider;
        this.feedbackForm = this.formBuilder.group({
            comment: [
                '',
                Validators.compose([Validators.minLength(1), Validators.required])
            ]
        });
        this.score = this.navParams.data.score;
        this.appName = this.appProvider.info.nameCase;
    }
    ionViewWillEnter() {
        this.navBar.backButtonClick = () => {
            this.persistenceProvider.getFeedbackInfo().then(info => {
                let feedbackInfo = info;
                feedbackInfo.sent = false;
                this.persistenceProvider.setFeedbackInfo(feedbackInfo);
                this.navCtrl.pop();
            });
        };
        switch (this.score) {
            case 1:
                this.reaction = this.translate.instant('Ouch!');
                this.comment = this.translate.instant("There's obviously something we're doing wrong. How could we improve your experience?");
                break;
            case 2:
                this.reaction = this.translate.instant('Oh no!');
                this.comment = this.translate.instant("There's obviously something we're doing wrong. How could we improve your experience?");
                break;
            case 3:
                this.reaction = 'Hmm...';
                this.comment = this.translate.instant("We'd love to do better. How could we improve your experience?");
                break;
            case 4:
                this.reaction = this.translate.instant('Thanks!');
                this.comment = this.translate.instant("That's exciting to hear. We'd love to earn that fifth star from you – how could we improve your experience?");
                break;
            case 5:
                this.reaction = this.translate.instant('Thank you!');
                this.comment = this.replaceParametersProvider.replace(this.translate.instant("We're always looking for ways to improve {{appName}}. Is there anything we could do better?"), { appName: this.appName });
                break;
            default:
                this.justFeedback = true;
                this.comment = this.replaceParametersProvider.replace(this.translate.instant("We're always looking for ways to improve {{appName}}. How could we improve your experience?"), { appName: this.appName });
                break;
        }
    }
    sendFeedback(feedback, goHome) {
        let config = this.configProvider.get();
        // console.log(config);
        // console.log(this.device.platform);
        // this.logger.info('THis is the config: ' + config);
        // this.logger.info('THis is the feedback: ' + feedback);
        let platform = this.device.platform || 'Unknown platform';
        // this.logger.info('THis is the platform: ' + platform);
        // console.log(platform);
        let version = this.device.version || 'Unknown version';
        // this.logger.info('THis is the version: ' + version);
        // console.log(version);//gc test
        // **GCEdit the following this.score value needs to be revisited.
        let dataSrc = {
            email: _.values(config.emailFor)[0] || ' ',
            feedback: goHome ? ' ' : feedback,
            score: this.score > 0 ? this.score : ' ',
            appVersion: this.appProvider.info.version,
            platform,
            deviceVersion: version
        };
        // this.logger.info('THis is the dataSrc: ' + dataSrc);
        if (!goHome)
            this.onGoingProcessProvider.set('sendingFeedback');
        this.feedbackProvider
            .send(dataSrc)
            .then(() => {
            if (goHome)
                return;
            this.onGoingProcessProvider.clear();
            // console.log(this.score);
            if (!this.score) {
                let title = this.translate.instant('Thank you!');
                let message = this.translate.instant('A member of the team will review your feedback as soon as possible.');
                let okText = this.translate.instant('Finish');
                this.popupProvider.ionicAlert(title, message, okText).then(() => {
                    this.feedback = '';
                    this.navCtrl.popToRoot({ animate: false });
                });
            }
            else {
                this.navCtrl.push(FeedbackCompletePage, { score: this.score });
            }
        })
            .catch(() => {
            if (goHome)
                return;
            this.onGoingProcessProvider.clear();
            let title = this.translate.instant('Error');
            let subtitle = this.translate.instant('Feedback could not be submitted. Please try again later.');
            this.popupProvider.ionicAlert(title, subtitle);
        });
        if (goHome) {
            this.navCtrl.popToRoot({ animate: false });
        }
    }
};
__decorate([
    ViewChild(Navbar),
    __metadata("design:type", Navbar)
], SendFeedbackPage.prototype, "navBar", void 0);
SendFeedbackPage = __decorate([
    Component({
        selector: 'page-send-feedback',
        templateUrl: 'send-feedback.html'
    }),
    __metadata("design:paramtypes", [ConfigProvider,
        NavController,
        NavParams,
        AppProvider,
        OnGoingProcessProvider,
        FeedbackProvider,
        FormBuilder,
        PersistenceProvider,
        PopupProvider,
        TranslateService,
        Device,
        ReplaceParametersProvider])
], SendFeedbackPage);
export { SendFeedbackPage };
//# sourceMappingURL=send-feedback.js.map