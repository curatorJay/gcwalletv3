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
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { TouchID } from '@ionic-native/touch-id';
// Providers
import { AppProvider } from '../../providers/app/app';
import { Logger } from '../../providers/logger/logger';
import { ConfigProvider } from '../config/config';
import { PlatformProvider } from '../platform/platform';
export var TouchIdErrors;
(function (TouchIdErrors) {
    TouchIdErrors["fingerprintCancelled"] = "FINGERPRINT_CANCELLED";
})(TouchIdErrors || (TouchIdErrors = {}));
let TouchIdProvider = class TouchIdProvider {
    constructor(app, touchId, androidFingerprintAuth, platform, config, logger) {
        this.app = app;
        this.touchId = touchId;
        this.androidFingerprintAuth = androidFingerprintAuth;
        this.platform = platform;
        this.config = config;
        this.logger = logger;
    }
    isAvailable() {
        return new Promise(resolve => {
            if (this.platform.isCordova && this.platform.isAndroid) {
                this.checkAndroid().then(isAvailable => {
                    return resolve(isAvailable);
                });
            }
            else if (this.platform.isCordova && this.platform.isIOS) {
                this.checkIOS().then(isAvailable => {
                    return resolve(isAvailable);
                });
            }
            else {
                return resolve(false);
            }
        });
    }
    checkIOS() {
        return new Promise(resolve => {
            this.touchId.isAvailable().then(() => {
                return resolve(true);
            }, () => {
                this.logger.debug('Fingerprint is not available');
                return resolve(false);
            });
        });
    }
    checkAndroid() {
        return new Promise(resolve => {
            this.androidFingerprintAuth
                .isAvailable()
                .then(res => {
                if (res.isAvailable)
                    return resolve(true);
                else {
                    this.logger.debug('Fingerprint is not available');
                    return resolve(false);
                }
            })
                .catch(() => {
                this.logger.warn('Touch ID (Android) is not available for this device');
                return resolve(false);
            });
        });
    }
    verifyIOSFingerprint() {
        return this.touchId
            .verifyFingerprint('Scan your fingerprint please')
            .catch(err => {
            if (err && (err.code == -2 || err.code == -128))
                err.message = TouchIdErrors.fingerprintCancelled;
            throw err;
        });
    }
    verifyAndroidFingerprint() {
        return this.androidFingerprintAuth
            .encrypt({ clientId: this.app.info.nameCase })
            .then(result => {
            if (result.withFingerprint) {
                this.logger.debug('Successfully authenticated with fingerprint.');
            }
            else if (result.withBackup) {
                this.logger.debug('Successfully authenticated with backup password!');
            }
            else
                this.logger.debug("Didn't authenticate!");
        })
            .catch(error => {
            const err = new Error(error);
            if (error === TouchIdErrors.fingerprintCancelled) {
                this.logger.debug('Fingerprint authentication cancelled');
                err.message = TouchIdErrors.fingerprintCancelled;
            }
            else {
                this.logger.warn('Could not get Fingerprint Authenticated', error);
            }
            throw err;
        });
    }
    check() {
        if (this.platform.isIOS)
            return this.verifyIOSFingerprint();
        if (this.platform.isAndroid)
            return this.verifyAndroidFingerprint();
        return undefined;
    }
    isNeeded(wallet) {
        let config = this.config.get();
        config.touchIdFor = config.touchIdFor || {};
        return config.touchIdFor[wallet.credentials.walletId];
    }
    checkWallet(wallet) {
        return this.isAvailable().then((isAvailable) => {
            if (!isAvailable)
                return undefined;
            if (this.isNeeded(wallet))
                return this.check();
            return undefined;
        });
    }
};
TouchIdProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AppProvider,
        TouchID,
        AndroidFingerprintAuth,
        PlatformProvider,
        ConfigProvider,
        Logger])
], TouchIdProvider);
export { TouchIdProvider };
//# sourceMappingURL=touchid.js.map