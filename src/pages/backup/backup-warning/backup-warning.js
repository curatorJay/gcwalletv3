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
import { AlertController, NavController, NavParams } from 'ionic-angular';
// pages
import { BackupGamePage } from '../backup-game/backup-game';
// Providers
import { Logger } from '../../../providers/logger/logger';
import { PopupProvider } from '../../../providers/popup/popup';
let BackupWarningPage = class BackupWarningPage {
    constructor(alertCtrl, logger, navCtrl, navParams, popupProvider) {
        this.alertCtrl = alertCtrl;
        this.logger = logger;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.popupProvider = popupProvider;
        this.walletId = this.navParams.get('walletId');
        this.fromOnboarding = this.navParams.get('fromOnboarding');
    }
    openWarningModal() {
        const backupWarningModal = this.popupProvider.createMiniModal('backup-warning');
        backupWarningModal.present({ animate: false });
        backupWarningModal.onDidDismiss(response => {
            if (response) {
                this.navCtrl.push(BackupGamePage, {
                    walletId: this.walletId,
                    fromOnboarding: this.fromOnboarding
                });
            }
            // **GCEdit: Added No-backup log for debugging
            else {
                this.logger.info('No backup at the onboarding phase');
            }
        });
    }
};
BackupWarningPage = __decorate([
    Component({
        selector: 'page-backup-warning',
        templateUrl: 'backup-warning.html'
    }),
    __metadata("design:paramtypes", [AlertController,
        Logger,
        NavController,
        NavParams,
        PopupProvider])
], BackupWarningPage);
export { BackupWarningPage };
//# sourceMappingURL=backup-warning.js.map