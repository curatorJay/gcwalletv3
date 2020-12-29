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
import { NavController } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// providers
import { AppProvider } from '../../../providers/app/app';
import { ConfigProvider } from '../../../providers/config/config';
import { EmailNotificationsProvider } from '../../../providers/email-notifications/email-notifications';
import { ExternalLinkProvider } from '../../../providers/external-link/external-link';
import { PersistenceProvider } from '../../../providers/persistence/persistence';
import { PlatformProvider } from '../../../providers/platform/platform';
import { PushNotificationsProvider } from '../../../providers/push-notifications/push-notifications';
// validators
import { EmailValidator } from '../../../validators/email';
let NotificationsPage = class NotificationsPage {
    constructor(navCtrl, formBuilder, configProvider, appProvider, platformProvider, pushProvider, emailProvider, externalLinkProvider, logger, persistenceProvider, translate) {
        this.navCtrl = navCtrl;
        this.formBuilder = formBuilder;
        this.configProvider = configProvider;
        this.appProvider = appProvider;
        this.platformProvider = platformProvider;
        this.pushProvider = pushProvider;
        this.emailProvider = emailProvider;
        this.externalLinkProvider = externalLinkProvider;
        this.logger = logger;
        this.persistenceProvider = persistenceProvider;
        this.translate = translate;
        this.emailForm = this.formBuilder.group({
            email: [
                '',
                Validators.compose([
                    Validators.required,
                    new EmailValidator(configProvider, emailProvider).isValid
                ])
            ]
        });
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad NotificationsPage');
        this.updateConfig();
    }
    updateConfig() {
        let config = this.configProvider.get();
        this.appName = this.appProvider.info.nameCase;
        this.usePushNotifications = this.platformProvider.isCordova;
        this.isIOSApp =
            this.platformProvider.isIOS && this.platformProvider.isCordova;
        this.pushNotifications = config.pushNotificationsEnabled;
        this.confirmedTxsNotifications = config.confirmedTxsNotifications
            ? config.confirmedTxsNotifications.enabled
            : false;
        this.emailForm.setValue({
            email: this.emailProvider.getEmailIfEnabled(config) || ''
        });
        this.emailNotifications = config.emailNotifications
            ? config.emailNotifications.enabled
            : false;
    }
    pushNotificationsChange() {
        let opts = {
            pushNotificationsEnabled: this.pushNotifications
        };
        this.configProvider.set(opts);
        if (opts.pushNotificationsEnabled)
            this.pushProvider.init();
        else
            this.pushProvider.disable();
    }
    confirmedTxsNotificationsChange() {
        let opts = {
            confirmedTxsNotifications: {
                enabled: this.confirmedTxsNotifications
            }
        };
        this.configProvider.set(opts);
    }
    emailNotificationsChange() {
        let opts = {
            enabled: this.emailNotifications,
            email: this.emailForm.value.email
        };
        this.emailProvider.updateEmail(opts);
    }
    saveEmail() {
        this.persistenceProvider.setEmailLawCompliance('accepted');
        this.emailProvider.updateEmail({
            enabled: this.emailNotifications,
            email: this.emailForm.value.email
        });
        this.navCtrl.pop();
    }
    openPrivacyPolicy() {
        let url = 'https://getcoins.com/privacy';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('View Privacy Policy');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
};
NotificationsPage = __decorate([
    Component({
        selector: 'page-notifications',
        templateUrl: 'notifications.html'
    }),
    __metadata("design:paramtypes", [NavController,
        FormBuilder,
        ConfigProvider,
        AppProvider,
        PlatformProvider,
        PushNotificationsProvider,
        EmailNotificationsProvider,
        ExternalLinkProvider,
        Logger,
        PersistenceProvider,
        TranslateService])
], NotificationsPage);
export { NotificationsPage };
//# sourceMappingURL=notifications.js.map