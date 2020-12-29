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
import { AlertController, NavController, NavParams } from 'ionic-angular';
// Providers
import { Logger } from '../../../providers/logger/logger';
import { PopupProvider } from '../../../providers/popup/popup';
// Pages
import { BackupWarningPage } from '../../backup/backup-warning/backup-warning';
import { DisclaimerPage } from '../disclaimer/disclaimer';
let BackupRequestPage = class BackupRequestPage {
    constructor(navCtrl, navParams, alertCtrl, log, translate, popupProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.log = log;
        this.translate = translate;
        this.popupProvider = popupProvider;
        this.walletId = this.navParams.get('walletId');
    }
    ionViewDidLoad() {
        this.log.info('ionViewDidLoad BackupRequestPage');
    }
    initBackupFlow() {
        this.navCtrl.push(BackupWarningPage, {
            walletId: this.walletId,
            fromOnboarding: true
        });
    }
    doBackupLater() {
        let title = this.translate.instant('Watch Out!');
        let message = this.translate.instant('If this device is replaced or this app is deleted, neither you nor GetCoins can recover your funds without a backup.');
        let okText = this.translate.instant('I understand');
        let cancelText = this.translate.instant('Go Back');
        this.popupProvider
            .ionicConfirm(title, message, okText, cancelText)
            .then(res => {
            if (!res)
                return;
            let title = this.translate.instant('Are you sure you want to skip it?');
            let message = this.translate.instant('You can create a backup later from your wallet settings.');
            let okText = this.translate.instant('Yes, skip');
            let cancelText = this.translate.instant('Go Back');
            this.popupProvider
                .ionicConfirm(title, message, okText, cancelText)
                .then(res => {
                if (!res)
                    return;
                this.navCtrl.push(DisclaimerPage);
            });
        });
    }
};
BackupRequestPage = __decorate([
    Component({
        selector: 'page-backup-request',
        templateUrl: 'backup-request.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        AlertController,
        Logger,
        TranslateService,
        PopupProvider])
], BackupRequestPage);
export { BackupRequestPage };
//# sourceMappingURL=backup-request.js.map