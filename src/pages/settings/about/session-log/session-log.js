var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController, ToastController } from 'ionic-angular';
// native
import { SocialSharing } from '@ionic-native/social-sharing';
// providers
import { ConfigProvider } from '../../../../providers/config/config';
import { Logger } from '../../../../providers/logger/logger';
import { PlatformProvider } from '../../../../providers/platform/platform';
import { PopupProvider } from '../../../../providers/popup/popup';
import * as _ from 'lodash';
let SessionLogPage = class SessionLogPage {
    constructor(dom, configProvider, logger, socialSharing, actionSheetCtrl, toastCtrl, platformProvider, translate, popupProvider) {
        this.configProvider = configProvider;
        this.logger = logger;
        this.socialSharing = socialSharing;
        this.actionSheetCtrl = actionSheetCtrl;
        this.toastCtrl = toastCtrl;
        this.platformProvider = platformProvider;
        this.translate = translate;
        this.popupProvider = popupProvider;
        this.dom = dom;
        this.config = this.configProvider.get();
        this.isCordova = this.platformProvider.isCordova;
        let logLevels = this.logger.getLevels();
        this.logOptions = _.keyBy(logLevels, 'weight');
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad SessionLogPage');
    }
    ionViewWillEnter() {
        let selectedLevel = _.has(this.config, 'log.weight')
            ? this.logger.getWeight(this.config.log.weight)
            : this.logger.getDefaultWeight();
        this.filterValue = selectedLevel.weight;
        this.setOptionSelected(selectedLevel.weight);
        this.filterLogs(selectedLevel.weight);
    }
    filterLogs(weight) {
        this.filteredLogs = this.logger.get(weight);
    }
    setOptionSelected(weight) {
        this.filterLogs(weight);
        let opts = {
            log: {
                weight
            }
        };
        this.configProvider.set(opts);
    }
    prepareLogs() {
        let log = 'GetCoins Session Logs\n Be careful, this could contain sensitive private data\n\n';
        log += '\n\n';
        log += this.logger
            .get()
            .map(v => {
            return '[' + v.timestamp + '][' + v.level + ']' + v.msg;
        })
            .join('\n');
        return log;
    }
    copyToClipboard() {
        let textarea = this.dom.createElement('textarea');
        this.dom.body.appendChild(textarea);
        textarea.value = this.prepareLogs();
        textarea.select();
        this.dom.execCommand('copy');
        let message = this.translate.instant('Copied to clipboard');
        let showSuccess = this.toastCtrl.create({
            message,
            duration: 1000
        });
        showSuccess.present();
    }
    sendLogs() {
        let body = this.prepareLogs();
        this.socialSharing.shareViaEmail(body, 'GetCoins Logs', null, // TO: must be null or an array
        null, // CC: must be null or an array
        null, // BCC: must be null or an array
        null // FILES: can be null, a string, or an array
        );
    }
    showOptionsMenu() {
        let copyText = this.translate.instant('Copy to clipboard');
        let emailText = this.translate.instant('Send by email');
        let button = [];
        if (this.isCordova) {
            button = [
                {
                    text: emailText,
                    handler: () => {
                        this.showWarningModal();
                    }
                }
            ];
        }
        else {
            button = [
                {
                    text: copyText,
                    handler: () => {
                        this.showWarningModal();
                    }
                }
            ];
        }
        let actionSheet = this.actionSheetCtrl.create({
            title: '',
            buttons: button
        });
        actionSheet.present();
    }
    showWarningModal() {
        const sessionLogWarningModal = this.popupProvider.createMiniModal('sensitive-info');
        sessionLogWarningModal.present();
        sessionLogWarningModal.onDidDismiss(response => {
            if (response)
                this.isCordova ? this.sendLogs() : this.copyToClipboard();
        });
    }
};
SessionLogPage = __decorate([
    Component({
        selector: 'page-session-log',
        templateUrl: 'session-log.html'
    }),
    __param(0, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [Document,
        ConfigProvider,
        Logger,
        SocialSharing,
        ActionSheetController,
        ToastController,
        PlatformProvider,
        TranslateService,
        PopupProvider])
], SessionLogPage);
export { SessionLogPage };
//# sourceMappingURL=session-log.js.map