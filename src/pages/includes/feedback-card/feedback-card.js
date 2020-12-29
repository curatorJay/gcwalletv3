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
import { NavController } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// providers
import { AppProvider } from '../../../providers/app/app';
import { PersistenceProvider } from '../../../providers/persistence/persistence';
import { PlatformProvider } from '../../../providers/platform/platform';
import { ReplaceParametersProvider } from '../../../providers/replace-parameters/replace-parameters';
// pages
import { FeedbackPage } from '../../../pages/feedback/feedback/feedback';
import { SendFeedbackPage } from '../../../pages/feedback/send-feedback/send-feedback';
let FeedbackCardPage = class FeedbackCardPage {
    constructor(appProvider, navCtrl, logger, persistenceProvider, translate, platformProvider, replaceParametersProvider) {
        this.appProvider = appProvider;
        this.navCtrl = navCtrl;
        this.logger = logger;
        this.persistenceProvider = persistenceProvider;
        this.translate = translate;
        this.platformProvider = platformProvider;
        this.replaceParametersProvider = replaceParametersProvider;
        this.score = 0;
        this.isCordova = this.platformProvider.isCordova;
        this.isShowRateCard = false;
    }
    // public setShowRateCard(value) { // *GC edit for temporary testing purpose
    setShowRateCard() {
        // this.isShowRateCard = value; 
        this.isShowRateCard = false; // *GC edit for temporary testing purpose
        if (this.isShowRateCard) {
            let appName = this.appProvider.info.nameCase;
            this.feedbackCardTitle = this.replaceParametersProvider.replace(this.translate.instant('How do you like {{appName}}?'), { appName });
        }
    }
    hideCard() {
        this.isShowRateCard = false;
        this.logger.debug('Feedback card dismissed.');
        this.persistenceProvider.getFeedbackInfo().then(info => {
            let feedbackInfo = info;
            feedbackInfo.sent = true;
            this.persistenceProvider.setFeedbackInfo(feedbackInfo);
        });
    }
    setScore(score) {
        this.score = score;
        switch (this.score) {
            case 1:
                this.button_title = this.translate.instant('I think this app is terrible');
                break;
            case 2:
                this.button_title = this.translate.instant("I don't like it");
                break;
            case 3:
                this.button_title = this.translate.instant("Meh - it's alright");
                break;
            case 4:
                this.button_title = this.translate.instant('I like the app');
                break;
            case 5:
                this.button_title = this.translate.instant('This app is fantastic!');
                break;
        }
    }
    goFeedbackFlow() {
        this.hideCard();
        if (this.isCordova && this.score == 5) {
            this.navCtrl.push(FeedbackPage, { score: this.score });
        }
        else {
            this.navCtrl.push(SendFeedbackPage, { score: this.score });
        }
    }
};
FeedbackCardPage = __decorate([
    Component({
        selector: 'page-feedback-card',
        templateUrl: 'feedback-card.html'
    }),
    __metadata("design:paramtypes", [AppProvider,
        NavController,
        Logger,
        PersistenceProvider,
        TranslateService,
        PlatformProvider,
        ReplaceParametersProvider])
], FeedbackCardPage);
export { FeedbackCardPage };
//# sourceMappingURL=feedback-card.js.map