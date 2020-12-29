var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Logger } from '../../providers/logger/logger';
// providers
import { NodeWebkitProvider } from '../node-webkit/node-webkit';
import { PlatformProvider } from '../platform/platform';
import { PopupProvider } from '../popup/popup';
let ExternalLinkProvider = class ExternalLinkProvider {
    constructor(popupProvider, logger, platformProvider, nodeWebkitProvider) {
        this.popupProvider = popupProvider;
        this.logger = logger;
        this.platformProvider = platformProvider;
        this.nodeWebkitProvider = nodeWebkitProvider;
        this.logger.info('ExternalLinkProvider initialized.');
    }
    restoreHandleOpenURL(old) {
        setTimeout(() => {
            window.handleOpenURL = old;
        }, 500);
    }
    open(url, optIn, title, message, okText, cancelText) {
        return new Promise(resolve => {
            if (optIn) {
                this.popupProvider
                    .ionicConfirm(title, message, okText, cancelText)
                    .then((res) => {
                    this.openBrowser(res, url);
                    resolve();
                });
            }
            else {
                this.openBrowser(true, url);
                resolve();
            }
        });
    }
    openBrowser(res, url) {
        let old = window.handleOpenURL;
        window.handleOpenURL = url => {
            // Ignore external URLs
            this.logger.debug('Skip: ' + url);
        };
        if (res)
            this.platformProvider.isNW
                ? this.nodeWebkitProvider.openExternalLink(url)
                : window.open(url, '_system');
        this.restoreHandleOpenURL(old);
    }
};
ExternalLinkProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PopupProvider,
        Logger,
        PlatformProvider,
        NodeWebkitProvider])
], ExternalLinkProvider);
export { ExternalLinkProvider };
//# sourceMappingURL=external-link.js.map