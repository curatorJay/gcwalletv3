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
import { Platform } from 'ionic-angular';
import { Logger } from '../../providers/logger/logger';
let PlatformProvider = class PlatformProvider {
    constructor(platform, logger) {
        this.platform = platform;
        this.logger = logger;
        let ua = navigator ? navigator.userAgent : null;
        if (!ua) {
            this.logger.info('Could not determine navigator. Using fixed string');
            ua = 'dummy user-agent';
        }
        // Fixes IOS WebKit UA
        ua = ua.replace(/\(\d+\)$/, '');
        this.isAndroid = this.platform.is('android');
        this.isIOS = this.platform.is('ios');
        this.ua = ua;
        this.isCordova = this.platform.is('cordova');
        this.isNW = this.isNodeWebkit();
        this.isMobile = this.platform.is('mobile');
        this.isDevel = !this.isMobile && !this.isNW;
        this.logger.info('PlatformProvider initialized.');
    }
    getBrowserName() {
        let userAgent = window.navigator.userAgent;
        let browsers = {
            chrome: /chrome/i,
            safari: /safari/i,
            firefox: /firefox/i,
            ie: /internet explorer/i
        };
        for (let key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
        }
        return 'unknown';
    }
    isNodeWebkit() {
        let isNode = typeof process !== 'undefined' && typeof require !== 'undefined';
        if (isNode) {
            try {
                return typeof window.require('nw.gui') !== 'undefined';
            }
            catch (e) {
                return false;
            }
        }
        return false;
    }
};
PlatformProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Platform, Logger])
], PlatformProvider);
export { PlatformProvider };
//# sourceMappingURL=platform.js.map