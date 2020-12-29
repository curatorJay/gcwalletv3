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
import { Logger } from '../../../../providers/logger/logger';
import * as _ from 'lodash';
// Providers
import { ConfigProvider } from '../../../../providers/config/config';
import { GlideraProvider } from '../../../../providers/glidera/glidera';
import { HomeIntegrationsProvider } from '../../../../providers/home-integrations/home-integrations';
import { PopupProvider } from '../../../../providers/popup/popup';
import { TabsPage } from '../../../tabs/tabs';
let GlideraSettingsPage = class GlideraSettingsPage {
    constructor(app, navCtrl, popupProvider, logger, glideraProvider, configProvider, homeIntegrationsProvider) {
        this.app = app;
        this.navCtrl = navCtrl;
        this.popupProvider = popupProvider;
        this.logger = logger;
        this.glideraProvider = glideraProvider;
        this.configProvider = configProvider;
        this.homeIntegrationsProvider = homeIntegrationsProvider;
        this.serviceName = 'glidera';
        this.account = {};
        this.service = _.filter(this.homeIntegrationsProvider.get(), {
            name: this.serviceName
        });
        this.showInHome = !!this.service[0].show;
    }
    ionViewDidEnter() {
        this.glideraProvider.init((err, glidera) => {
            if (err || !glidera) {
                if (err)
                    this.showErrorAndBack('Error connecting Glidera', err);
                return;
            }
            this.account.token = glidera.token;
            this.account.permissions = glidera.permissions;
            this.account.status = glidera.status;
            this.glideraProvider.updateStatus(this.account);
        });
    }
    showErrorAndBack(title, msg) {
        title = title ? title : 'Error';
        this.logger.error(msg);
        msg = msg && msg.errors ? msg.errors[0].message : msg;
        this.popupProvider.ionicAlert(title, msg).then(() => {
            this.navCtrl.pop();
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
            .ionicConfirm('Glidera', 'Are you sure you would like to log out of your Glidera account?')
            .then(res => {
            if (res) {
                this.glideraProvider.remove();
                this.app.getRootNavs()[0].setRoot(TabsPage);
            }
        });
    }
};
GlideraSettingsPage = __decorate([
    Component({
        selector: 'page-glidera-settings',
        templateUrl: 'glidera-settings.html'
    }),
    __metadata("design:paramtypes", [App,
        NavController,
        PopupProvider,
        Logger,
        GlideraProvider,
        ConfigProvider,
        HomeIntegrationsProvider])
], GlideraSettingsPage);
export { GlideraSettingsPage };
//# sourceMappingURL=glidera-settings.js.map