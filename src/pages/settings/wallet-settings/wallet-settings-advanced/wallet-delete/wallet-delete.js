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
import { App, Events, NavParams } from 'ionic-angular';
import { Logger } from '../../../../../providers/logger/logger';
// providers
import { OnGoingProcessProvider } from '../../../../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../../../../providers/popup/popup';
import { ProfileProvider } from '../../../../../providers/profile/profile';
import { PushNotificationsProvider } from '../../../../../providers/push-notifications/push-notifications';
import { TabsPage } from '../../../../tabs/tabs';
let WalletDeletePage = class WalletDeletePage {
    constructor(app, profileProvider, navParams, popupProvider, onGoingProcessProvider, pushNotificationsProvider, logger, events, translate) {
        this.app = app;
        this.profileProvider = profileProvider;
        this.navParams = navParams;
        this.popupProvider = popupProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.pushNotificationsProvider = pushNotificationsProvider;
        this.logger = logger;
        this.events = events;
        this.translate = translate;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad WalletDeletePage');
    }
    ionViewWillEnter() {
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.walletName = this.wallet.name;
    }
    showDeletePopup() {
        let title = this.translate.instant('Warning!');
        let message = this.translate.instant('Are you sure you want to delete this wallet?');
        this.popupProvider.ionicConfirm(title, message, null, null).then(res => {
            if (res)
                this.deleteWallet();
        });
    }
    deleteWallet() {
        this.onGoingProcessProvider.set('deletingWallet');
        this.profileProvider
            .deleteWalletClient(this.wallet)
            .then(() => {
            this.events.publish('status:updated');
            this.onGoingProcessProvider.clear();
            this.pushNotificationsProvider.unsubscribe(this.wallet);
            this.app.getRootNavs()[0].setRoot(TabsPage);
        })
            .catch(err => {
            this.popupProvider.ionicAlert(this.translate.instant('Error'), err.message || err);
        });
    }
};
WalletDeletePage = __decorate([
    Component({
        selector: 'page-wallet-delete',
        templateUrl: 'wallet-delete.html'
    }),
    __metadata("design:paramtypes", [App,
        ProfileProvider,
        NavParams,
        PopupProvider,
        OnGoingProcessProvider,
        PushNotificationsProvider,
        Logger,
        Events,
        TranslateService])
], WalletDeletePage);
export { WalletDeletePage };
//# sourceMappingURL=wallet-delete.js.map