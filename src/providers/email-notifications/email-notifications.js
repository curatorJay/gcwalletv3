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
import { ConfigProvider } from '../config/config';
import { ProfileProvider } from '../profile/profile';
import { WalletProvider } from '../wallet/wallet';
import * as _ from 'lodash';
let EmailNotificationsProvider = class EmailNotificationsProvider {
    constructor(configProvider, profileProvider, walletProvider, logger) {
        this.configProvider = configProvider;
        this.profileProvider = profileProvider;
        this.walletProvider = walletProvider;
        this.logger = logger;
        this.logger.info('EmailNotificationsProvider initialized');
    }
    updateEmail(opts) {
        opts = opts || {};
        if (!opts.email)
            return;
        this.configProvider.set({
            emailFor: null,
            emailNotifications: {
                enabled: opts.enabled,
                email: opts.enabled ? opts.email : null
            }
        });
        setTimeout(() => {
            let wallets = this.profileProvider.getWallets();
            this.walletProvider.updateRemotePreferences(wallets);
        }, 1000);
    }
    getEmailIfEnabled(config) {
        config = config ? config : this.configProvider.get();
        if (config.emailNotifications) {
            if (!config.emailNotifications.enabled)
                return;
            if (config.emailNotifications.email)
                return config.emailNotifications.email;
        }
        if (_.isEmpty(config.emailFor))
            return;
        // Backward compatibility
        let emails = _.values(config.emailFor);
        for (var i = 0; i < emails.length; i++) {
            if (emails[i] !== null && typeof emails[i] !== 'undefined') {
                return emails[i];
            }
        }
    }
    init() {
        let config = this.configProvider.get();
        if (config.emailNotifications && config.emailNotifications.enabled) {
            // If email already set
            if (config.emailNotifications.email)
                return;
            var currentEmail = this.getEmailIfEnabled(config);
            this.updateEmail({
                enabled: currentEmail ? true : false,
                email: currentEmail
            });
        }
    }
};
EmailNotificationsProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigProvider,
        ProfileProvider,
        WalletProvider,
        Logger])
], EmailNotificationsProvider);
export { EmailNotificationsProvider };
//# sourceMappingURL=email-notifications.js.map