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
import { Injectable } from '@angular/core';
// providers
import { AppProvider } from '../../providers/app/app';
import { Logger } from '../../providers/logger/logger';
let FeedbackProvider = class FeedbackProvider {
    constructor(http, logger, appProvider) {
        this.http = http;
        this.logger = logger;
        this.appProvider = appProvider;
        // Get more info: https://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/
        this.URL =
            this.appProvider.servicesInfo &&
                this.appProvider.servicesInfo.feedbackSheetURL
                ? this.appProvider.servicesInfo.feedbackSheetURL
                : null;
        // this.logger.info('This is in feedback.ts');
    }
    send(dataSrc) {
        return new Promise((resolve, reject) => {
            if (!this.URL)
                return resolve();
            // this.logger.info('This is dataSrc: ' + dataSrc);
            // console.log('This is dataSrc: ' + dataSrc);
            const headers = new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            });
            const urlSearchParams = new HttpParams()
                .set('Email', dataSrc.email)
                .set('Feedback', dataSrc.feedback)
                .set('Score', dataSrc.score)
                .set('AppVersion', dataSrc.appVersion)
                .set('Platform', dataSrc.platform)
                .set('DeviceVersion', dataSrc.deviceVersion);
            this.http
                .post(this.URL, null, {
                params: urlSearchParams,
                headers
            })
                .subscribe(() => {
                this.logger.info('SUCCESS: Feedback sent');
                return resolve();
            }, err => {
                this.logger.info('ERROR: Feedback sent anyway.');
                return reject(err);
            });
        });
    }
    isVersionUpdated(currentVersion, savedVersion) {
        let verifyTagFormat = tag => {
            let regex = /^v?\d+\.\d+\.\d+$/i;
            return regex.exec(tag);
        };
        let formatTagNumber = tag => {
            let formattedNumber = tag.replace(/^v/i, '').split('.');
            return {
                major: +formattedNumber[0],
                minor: +formattedNumber[1],
                patch: +formattedNumber[2]
            };
        };
        if (!verifyTagFormat(currentVersion)) {
            return 'Cannot verify the format of version tag: ' + currentVersion;
        }
        if (!verifyTagFormat(savedVersion)) {
            return ('Cannot verify the format of the saved version tag: ' + savedVersion);
        }
        let current = formatTagNumber(currentVersion);
        let saved = formatTagNumber(savedVersion);
        if (saved.major == current.major && saved.minor == current.minor) {
            return true;
        }
        return false;
    }
};
FeedbackProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient,
        Logger,
        AppProvider])
], FeedbackProvider);
export { FeedbackProvider };
//# sourceMappingURL=feedback.js.map