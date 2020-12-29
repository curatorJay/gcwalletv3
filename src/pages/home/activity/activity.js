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
import { ModalController, NavController } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// providers
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../../providers/popup/popup';
import { ProfileProvider } from '../../../providers/profile/profile';
import { WalletProvider } from '../../../providers/wallet/wallet';
// pages
import { TxDetailsPage } from '../../tx-details/tx-details';
import { TxpDetailsPage } from '../../txp-details/txp-details';
import * as _ from 'lodash';
let ActivityPage = class ActivityPage {
    constructor(navCtrl, logger, profileProvider, modalCtrl, onGoingProcessProvider, walletProvider, popupProvider, translate) {
        this.navCtrl = navCtrl;
        this.logger = logger;
        this.profileProvider = profileProvider;
        this.modalCtrl = modalCtrl;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.walletProvider = walletProvider;
        this.popupProvider = popupProvider;
        this.translate = translate;
    }
    ionViewWillEnter() {
        let loading = this.translate.instant('Updating... Please stand by');
        this.onGoingProcessProvider.set(loading);
        this.profileProvider
            .getNotifications(50)
            .then(nData => {
            this.onGoingProcessProvider.clear();
            this.notifications = nData.notifications;
            this.profileProvider
                .getTxps({})
                .then(txpsData => {
                this.txps = txpsData.txps;
            })
                .catch(err => {
                this.logger.error(err);
            });
        })
            .catch(err => {
            this.onGoingProcessProvider.clear();
            this.logger.error(err);
        });
    }
    openNotificationModal(n) {
        let wallet = this.profileProvider.getWallet(n.walletId);
        if (n.txid) {
            this.navCtrl.push(TxDetailsPage, { txid: n.txid, walletId: n.walletId });
        }
        else {
            let txp = _.find(this.txps, {
                id: n.txpId
            });
            if (txp) {
                let modal = this.modalCtrl.create(TxpDetailsPage, { tx: txp }, { showBackdrop: false, enableBackdropDismiss: false });
                modal.present();
            }
            else {
                this.onGoingProcessProvider.set('loadingTxInfo');
                this.walletProvider
                    .getTxp(wallet, n.txpId)
                    .then(txp => {
                    let _txp = txp;
                    this.onGoingProcessProvider.clear();
                    let modal = this.modalCtrl.create(TxpDetailsPage, { tx: _txp }, { showBackdrop: false, enableBackdropDismiss: false });
                    modal.present();
                })
                    .catch(() => {
                    this.onGoingProcessProvider.clear();
                    this.logger.warn('No txp found');
                    let title = this.translate.instant('Error');
                    let subtitle = this.translate.instant('Transaction not found');
                    this.popupProvider.ionicAlert(title, subtitle);
                });
            }
        }
    }
};
ActivityPage = __decorate([
    Component({
        selector: 'page-activity',
        templateUrl: 'activity.html'
    }),
    __metadata("design:paramtypes", [NavController,
        Logger,
        ProfileProvider,
        ModalController,
        OnGoingProcessProvider,
        WalletProvider,
        PopupProvider,
        TranslateService])
], ActivityPage);
export { ActivityPage };
//# sourceMappingURL=activity.js.map