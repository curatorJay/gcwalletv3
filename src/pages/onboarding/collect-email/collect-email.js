var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// native
import { Device } from '@ionic-native/device';
// providers
import { AppProvider } from '../../../providers/app/app';
// pages
import { EmailNotificationsProvider } from '../../../providers/email-notifications/email-notifications';
import { BackupRequestPage } from '../backup-request/backup-request';
let CollectEmailPage = class CollectEmailPage {
    constructor(navCtrl, navParams, logger, fb, appProvider, http, emailProvider, device) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.logger = logger;
        this.fb = fb;
        this.appProvider = appProvider;
        this.http = http;
        this.emailProvider = emailProvider;
        this.device = device;
        this.walletId = this.navParams.data.walletId;
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.emailForm = this.fb.group({
            email: [null, [Validators.required, Validators.pattern(regex)]],
            accept: [false]
        });
        this.showConfirmForm = false;
        // Get more info: https://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/
        this.URL =
            this.appProvider.servicesInfo &&
                this.appProvider.servicesInfo.emailSheetURL
                ? this.appProvider.servicesInfo.emailSheetURL
                : null;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad CollectEmailPage');
    }
    skip() {
        this.goToBackupRequestPage();
    }
    showConfirm() {
        this.showConfirmForm = !this.showConfirmForm;
    }
    save() {
        let opts = {
            enabled: true,
            email: this.emailForm.value.email
        };
        // Confirm for notifications
        this.emailProvider.updateEmail(opts);
        // Confirm to get news and updates from GetCoins
        if (this.emailForm.value.accept)
            this.collectEmail();
        this.goToBackupRequestPage();
    }
    goToBackupRequestPage() {
        this.navCtrl.push(BackupRequestPage, { walletId: this.walletId });
    }
    collectEmail() {
        if (!this.URL)
            return;
        let platform = this.device.platform || 'Unknown platform';
        let version = this.device.version || 'Unknown version';
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        });
        const urlSearchParams = new HttpParams()
            .set('App', this.appProvider.info.nameCase)
            .set('Email', this.emailForm.value.email)
            .set('AppVersion', this.appProvider.info.version)
            .set('Platform', platform)
            .set('DeviceVersion', version);
        this.http
            .post(this.URL, null, {
            params: urlSearchParams,
            headers
        })
            .subscribe(() => {
            this.logger.info('SUCCESS: Email collected');
        }, () => {
            this.logger.error('ERROR: Could not collect email');
        });
    }
};
CollectEmailPage = __decorate([
    Component({
        selector: 'page-collect-email',
        templateUrl: 'collect-email.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Logger,
        FormBuilder,
        AppProvider,
        HttpClient,
        EmailNotificationsProvider,
        Device])
], CollectEmailPage);
export { CollectEmailPage };
//# sourceMappingURL=collect-email.js.map