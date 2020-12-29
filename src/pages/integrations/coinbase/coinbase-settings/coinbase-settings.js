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
import { App, NavController } from 'ionic-angular';
import * as _ from 'lodash';
// Providers
import { CoinbaseProvider } from '../../../../providers/coinbase/coinbase';
import { ConfigProvider } from '../../../../providers/config/config';
import { HomeIntegrationsProvider } from '../../../../providers/home-integrations/home-integrations';
import { Logger } from '../../../../providers/logger/logger';
import { PopupProvider } from '../../../../providers/popup/popup';
import { TabsPage } from '../../../tabs/tabs';
let CoinbaseSettingsPage = class CoinbaseSettingsPage {
    constructor(app, navCtrl, popupProvider, logger, coinbaseProvider, configProvider, homeIntegrationsProvider) {
        this.app = app;
        this.navCtrl = navCtrl;
        this.popupProvider = popupProvider;
        this.logger = logger;
        this.coinbaseProvider = coinbaseProvider;
        this.configProvider = configProvider;
        this.homeIntegrationsProvider = homeIntegrationsProvider;
        this.serviceName = 'coinbase';
        this.service = _.filter(this.homeIntegrationsProvider.get(), {
            name: this.serviceName
        });
        this.showInHome = !!this.service[0].show;
    }
    ionViewDidLoad() {
        this.coinbaseProvider.init((err, data) => {
            if (err || _.isEmpty(data)) {
                if (err) {
                    this.logger.error(err);
                    let errorId = err.errors ? err.errors[0].id : null;
                    err = err.errors ? err.errors[0].message : err;
                    this.popupProvider
                        .ionicAlert('Error connecting to Coinbase', err)
                        .then(() => {
                        if (errorId == 'revoked_token') {
                            this.coinbaseProvider.logout();
                            this.navCtrl.popToRoot({ animate: false });
                        }
                    });
                }
                return;
            }
            let accessToken = data.accessToken;
            let accountId = data.accountId;
            this.coinbaseProvider.getAccount(accessToken, accountId, (_, account) => {
                this.coinbaseAccount = account.data[0];
            });
            this.coinbaseProvider.getCurrentUser(accessToken, (_, user) => {
                this.coinbaseUser = user.data;
            });
        });
    }
    showInHomeSwitch() {
        let opts = {
            showIntegration: { [this.serviceName]: this.showInHome }
        };
        this.homeIntegrationsProvider.updateConfig(this.serviceName, this.showInHome);
        this.configProvider.set(opts);
    }
    revokeToken() {
        this.popupProvider
            .ionicConfirm('Coinbase', 'Are you sure you would like to log out of your Coinbase account?')
            .then(res => {
            if (res) {
                this.coinbaseProvider.logout();
                this.app.getRootNavs()[0].setRoot(TabsPage);
            }
        });
    }
};
CoinbaseSettingsPage = __decorate([
    Component({
        selector: 'page-coinbase-settings',
        templateUrl: 'coinbase-settings.html'
    }),
    __metadata("design:paramtypes", [App,
        NavController,
        PopupProvider,
        Logger,
        CoinbaseProvider,
        ConfigProvider,
        HomeIntegrationsProvider])
], CoinbaseSettingsPage);
export { CoinbaseSettingsPage };
//# sourceMappingURL=coinbase-settings.js.map