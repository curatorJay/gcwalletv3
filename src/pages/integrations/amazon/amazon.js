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
import { ModalController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from '../../../providers/logger/logger';
// Pages
import { AmountPage } from '../../send/amount/amount';
import { AmazonCardDetailsPage } from './amazon-card-details/amazon-card-details';
// Providers
import { AmazonProvider } from '../../../providers/amazon/amazon';
import { ExternalLinkProvider } from '../../../providers/external-link/external-link';
import { PopupProvider } from '../../../providers/popup/popup';
import { TimeProvider } from '../../../providers/time/time';
let AmazonPage = class AmazonPage {
    constructor(amazonProvider, externalLinkProvider, logger, modalCtrl, navCtrl, navParams, popupProvider, timeProvider) {
        this.amazonProvider = amazonProvider;
        this.externalLinkProvider = externalLinkProvider;
        this.logger = logger;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.popupProvider = popupProvider;
        this.timeProvider = timeProvider;
        this.updatePendingGiftCards = _.debounce(() => {
            this.updatingPending = {};
            this.updateGiftCards()
                .then(() => {
                let gcds = this.giftCards;
                _.forEach(gcds, dataFromStorage => {
                    this.updateGiftCard = this.checkIfCardNeedsUpdate(dataFromStorage);
                    if (this.updateGiftCard) {
                        this.logger.debug('Creating / Updating gift card');
                        this.updatingPending[dataFromStorage.invoiceId] = true;
                        this.amazonProvider.createGiftCard(dataFromStorage, (err, giftCard) => {
                            this.updatingPending[dataFromStorage.invoiceId] = false;
                            if (err) {
                                this.logger.error('Error creating gift card:', err);
                                giftCard = giftCard || {};
                                giftCard['status'] = 'FAILURE';
                            }
                            if (giftCard.status != 'PENDING') {
                                let newData = {};
                                _.merge(newData, dataFromStorage, giftCard);
                                if (newData.status == 'expired') {
                                    this.amazonProvider.savePendingGiftCard(newData, {
                                        remove: true
                                    }, () => {
                                        this.updateGiftCards();
                                    });
                                    return;
                                }
                                this.amazonProvider.savePendingGiftCard(newData, null, () => {
                                    this.logger.debug('Amazon gift card updated');
                                    this.updateGiftCards();
                                });
                            }
                        });
                    }
                });
            })
                .catch(err => {
                this.logger.error(err);
            });
        }, 1000, {
            leading: true
        });
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad AmazonPage');
        this.network = this.amazonProvider.getNetwork();
        this.initAmazon().then(() => {
            if (this.giftCards) {
                this.updatePendingGiftCards();
            }
        });
    }
    ionViewWillEnter() {
        if (this.giftCards) {
            this.invoiceId = this.navParams.data.invoiceId;
            this.updateGiftCards()
                .then(() => {
                if (this.invoiceId) {
                    let card = _.find(this.giftCards, {
                        invoiceId: this.invoiceId
                    });
                    if (_.isEmpty(card)) {
                        this.popupProvider.ionicAlert(null, 'Card not found');
                        return;
                    }
                    this.updateGiftCard = this.checkIfCardNeedsUpdate(card);
                    this.invoiceId = this.navParams.data.invoiceId = null;
                    this.openCardModal(card);
                }
            })
                .catch(err => {
                this.logger.error('Amazon: could not update gift cards', err);
            });
        }
    }
    initAmazon() {
        return new Promise(resolve => {
            this.amazonProvider.getPendingGiftCards((err, gcds) => {
                if (err)
                    this.logger.error(err);
                this.giftCards = gcds;
                return resolve();
            });
        });
    }
    checkIfCardNeedsUpdate(card) {
        // Continues normal flow (update card)
        if (card.status == 'PENDING' || card.status == 'invalid') {
            return true;
        }
        // Check if card status FAILURE for 24 hours
        if (card.status == 'FAILURE' &&
            this.timeProvider.withinPastDay(card.date)) {
            return true;
        }
        // Success: do not update
        return false;
    }
    updateGiftCards() {
        return new Promise((resolve, reject) => {
            this.amazonProvider.getPendingGiftCards((err, gcds) => {
                if (err) {
                    this.popupProvider.ionicAlert('Could not get gift cards', err);
                    return reject(err);
                }
                this.giftCards = gcds;
                return resolve();
            });
        });
    }
    openCardModal(card) {
        this.card = card;
        let modal = this.modalCtrl.create(AmazonCardDetailsPage, {
            card: this.card,
            updateGiftCard: this.updateGiftCard
        });
        modal.present();
        modal.onDidDismiss(() => {
            this.updatePendingGiftCards();
        });
    }
    openExternalLink(url) {
        this.externalLinkProvider.open(url);
    }
    goTo(page) {
        switch (page) {
            case 'Amount':
                this.navCtrl.push(AmountPage, {
                    nextPage: 'BuyAmazonPage',
                    currency: 'USD',
                    fixedUnit: true
                });
                break;
        }
    }
};
AmazonPage = __decorate([
    Component({
        selector: 'page-amazon',
        templateUrl: 'amazon.html'
    }),
    __metadata("design:paramtypes", [AmazonProvider,
        ExternalLinkProvider,
        Logger,
        ModalController,
        NavController,
        NavParams,
        PopupProvider,
        TimeProvider])
], AmazonPage);
export { AmazonPage };
//# sourceMappingURL=amazon.js.map