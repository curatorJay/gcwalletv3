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
import { App, Events, NavController, NavParams } from 'ionic-angular';
// Pages
import { WalletDetailsPage } from '../../../pages/wallet-details/wallet-details';
// Providers
import { AppProvider } from '../../../providers/app/app';
import { BwcErrorProvider } from '../../../providers/bwc-error/bwc-error';
import { Logger } from '../../../providers/logger/logger';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PlatformProvider } from '../../../providers/platform/platform';
import { PopupProvider } from '../../../providers/popup/popup';
import { ProfileProvider } from '../../../providers/profile/profile';
import { PushNotificationsProvider } from '../../../providers/push-notifications/push-notifications';
import { WalletProvider } from '../../../providers/wallet/wallet';
import { TabsPage } from '../../tabs/tabs';
let CopayersPage = class CopayersPage {
    constructor(app, appProvider, bwcErrorProvider, events, logger, navCtrl, navParams, platformProvider, popupProvider, profileProvider, onGoingProcessProvider, walletProvider, translate, pushNotificationsProvider) {
        this.app = app;
        this.appProvider = appProvider;
        this.bwcErrorProvider = bwcErrorProvider;
        this.events = events;
        this.logger = logger;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.platformProvider = platformProvider;
        this.popupProvider = popupProvider;
        this.profileProvider = profileProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.walletProvider = walletProvider;
        this.translate = translate;
        this.pushNotificationsProvider = pushNotificationsProvider;
        this.appName = this.appProvider.info.userVisibleName;
        this.appUrl = this.appProvider.info.url;
        this.isCordova = this.platformProvider.isCordova;
        this.secret = null;
    }
    ionViewWillEnter() {
        this.logger.info('ionViewDidLoad CopayersPage');
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.updateWallet();
        this.events.subscribe('bwsEvent', (walletId, type) => {
            if (this.wallet &&
                walletId == this.wallet.id &&
                type == ('NewCopayer' || 'WalletComplete')) {
                this.updateWallet();
            }
        });
    }
    ionViewWillLeave() {
        this.events.unsubscribe('bwsEvent');
    }
    updateWallet() {
        this.logger.debug('Updating wallet:' + this.wallet.name);
        this.walletProvider
            .getStatus(this.wallet, {})
            .then(status => {
            this.wallet.status = status;
            this.copayers = this.wallet.status.wallet.copayers;
            this.secret = this.wallet.status.wallet.secret;
            if (status.wallet.status == 'complete') {
                this.wallet.openWallet(err => {
                    if (err)
                        this.logger.error(err);
                    this.navCtrl.popToRoot();
                    this.navCtrl.push(WalletDetailsPage, {
                        walletId: this.wallet.credentials.walletId
                    });
                });
            }
        })
            .catch(err => {
            let message = this.translate.instant('Could not update wallet');
            this.popupProvider.ionicAlert(this.bwcErrorProvider.msg(err, message));
            return;
        });
    }
    showDeletePopup() {
        let title = this.translate.instant('Confirm');
        let msg = this.translate.instant('Are you sure you want to cancel and delete this wallet?');
        this.popupProvider.ionicConfirm(title, msg).then(res => {
            if (res)
                this.deleteWallet();
        });
    }
    deleteWallet() {
        this.onGoingProcessProvider.set('deletingWallet');
        this.profileProvider
            .deleteWalletClient(this.wallet)
            .then(() => {
            this.onGoingProcessProvider.clear();
            this.pushNotificationsProvider.unsubscribe(this.wallet);
            this.app.getRootNavs()[0].setRoot(TabsPage);
        })
            .catch(err => {
            this.onGoingProcessProvider.clear();
            let errorText = this.translate.instant('Error');
            this.popupProvider.ionicAlert(errorText, err.message || err);
        });
    }
};
CopayersPage = __decorate([
    Component({
        selector: 'page-copayers',
        templateUrl: 'copayers.html'
    }),
    __metadata("design:paramtypes", [App,
        AppProvider,
        BwcErrorProvider,
        Events,
        Logger,
        NavController,
        NavParams,
        PlatformProvider,
        PopupProvider,
        ProfileProvider,
        OnGoingProcessProvider,
        WalletProvider,
        TranslateService,
        PushNotificationsProvider])
], CopayersPage);
export { CopayersPage };
//# sourceMappingURL=copayers.js.map