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
import { NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from '../../../../providers/logger/logger';
// Provider
import { AmazonProvider } from '../../../../providers/amazon/amazon';
import { BwcErrorProvider } from '../../../../providers/bwc-error/bwc-error';
import { ExternalLinkProvider } from '../../../../providers/external-link/external-link';
import { OnGoingProcessProvider } from '../../../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../../../providers/popup/popup';
let AmazonCardDetailsPage = class AmazonCardDetailsPage {
    constructor(amazonProvider, bwcErrorProvider, logger, externalLinkProvider, navParams, onGoingProcessProvider, popupProvider, viewCtrl) {
        this.amazonProvider = amazonProvider;
        this.bwcErrorProvider = bwcErrorProvider;
        this.logger = logger;
        this.externalLinkProvider = externalLinkProvider;
        this.navParams = navParams;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.popupProvider = popupProvider;
        this.viewCtrl = viewCtrl;
        this.card = this.navParams.data.card;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad AmazonCardDetailsPage');
    }
    cancelGiftCard() {
        this.onGoingProcessProvider.set('cancelingGiftCard');
        this.amazonProvider.cancelGiftCard(this.card, (err, data) => {
            this.onGoingProcessProvider.clear();
            if (err) {
                this.popupProvider.ionicAlert('Error canceling gift card', this.bwcErrorProvider.msg(err));
                return;
            }
            this.card.cardStatus = data.cardStatus;
            this.amazonProvider.savePendingGiftCard(this.card, null, () => {
                this.refreshGiftCard();
            });
        });
    }
    remove() {
        this.amazonProvider.savePendingGiftCard(this.card, {
            remove: true
        }, () => {
            this.close();
        });
    }
    refreshGiftCard() {
        if (!this.updateGiftCard)
            return;
        this.onGoingProcessProvider.set('updatingGiftCard');
        this.amazonProvider.getPendingGiftCards((err, giftCards) => {
            this.onGoingProcessProvider.clear();
            if (err) {
                this.popupProvider.ionicAlert('Error', err);
                return;
            }
            _.forEach(giftCards, function (dataFromStorage) {
                if (dataFromStorage.invoiceId == this.card.invoiceId) {
                    this.logger.debug('creating gift card');
                    this.amazonProvider.createGiftCard(dataFromStorage, (err, giftCard) => {
                        if (err) {
                            this.popupProvider.ionicAlert('Error', this.bwcErrorProvider.msg(err));
                            return;
                        }
                        if (!_.isEmpty(giftCard) && giftCard.status != 'PENDING') {
                            var newData = {};
                            _.merge(newData, dataFromStorage, giftCard);
                            if (newData.status == 'expired') {
                                this.amazonProvider.savePendingGiftCard(newData, {
                                    remove: true
                                }, () => {
                                    this.close();
                                });
                                return;
                            }
                            this.amazonProvider.savePendingGiftCard(newData, null, () => {
                                this.logger.debug('Amazon gift card updated');
                                this.card = newData;
                            });
                        }
                        else
                            this.logger.debug('Pending gift card not available yet');
                    });
                }
            });
        });
    }
    close() {
        this.viewCtrl.dismiss();
    }
    openExternalLink(url) {
        this.externalLinkProvider.open(url);
    }
};
AmazonCardDetailsPage = __decorate([
    Component({
        selector: 'page-amazon-card-details',
        templateUrl: 'amazon-card-details.html'
    }),
    __metadata("design:paramtypes", [AmazonProvider,
        BwcErrorProvider,
        Logger,
        ExternalLinkProvider,
        NavParams,
        OnGoingProcessProvider,
        PopupProvider,
        ViewController])
], AmazonCardDetailsPage);
export { AmazonCardDetailsPage };
//# sourceMappingURL=amazon-card-details.js.map