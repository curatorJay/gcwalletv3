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
import { TabsPage } from '../../tabs/tabs';
import { EmailNotificationsProvider } from '../../../providers/email-notifications/email-notifications';
import { ExternalLinkProvider } from '../../../providers/external-link/external-link';
import { PersistenceProvider } from '../../../providers/persistence/persistence';
let DisclaimerPage = class DisclaimerPage {
    constructor(navCtrl, logger, emailProvider, externalLinkProvider, persistenceProvider, translate) {
        this.navCtrl = navCtrl;
        this.logger = logger;
        this.emailProvider = emailProvider;
        this.externalLinkProvider = externalLinkProvider;
        this.persistenceProvider = persistenceProvider;
        this.translate = translate;
        this.hasEmail = this.emailProvider.getEmailIfEnabled() ? true : false;
        this.accepted = {
            first: false,
            second: false,
            third: this.hasEmail ? false : true
        };
        this.terms = {
            accepted: false
        };
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad DisclaimerPage');
    }
    selectTerms() {
        this.terms.accepted = !this.terms.accepted;
    }
    openDisclaimer() {
        let url = 'https://getcoins.com/about/terms';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('View Wallet Terms and Conditions');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    openPrivacyPolicy() {
        let url = 'https://getcoins.com/about/privacy';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('View Privacy Policy');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    confirm() {
        this.persistenceProvider.setEmailLawCompliance('accepted');
        this.persistenceProvider.setDisclaimerAccepted();
        this.navCtrl.setRoot(TabsPage);
        this.navCtrl.popToRoot({ animate: false });
    }
};
DisclaimerPage = __decorate([
    Component({
        selector: 'page-disclaimer',
        templateUrl: 'disclaimer.html'
    }),
    __metadata("design:paramtypes", [NavController,
        Logger,
        EmailNotificationsProvider,
        ExternalLinkProvider,
        PersistenceProvider,
        TranslateService])
], DisclaimerPage);
export { DisclaimerPage };
//# sourceMappingURL=disclaimer.js.map