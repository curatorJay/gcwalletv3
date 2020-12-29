var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController, Navbar, NavController, Slides } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// pages
// import { BackupRequestPage } from '../backup-request/backup-request';
// import { CollectEmailPage } from '../collect-email/collect-email'; // **GCEdit: disabling it till next ver
// providers
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PersistenceProvider } from '../../../providers/persistence/persistence';
import { PopupProvider } from '../../../providers/popup/popup';
import { ProfileProvider } from '../../../providers/profile/profile';
import { RateProvider } from '../../../providers/rate/rate';
import { TxFormatProvider } from '../../../providers/tx-format/tx-format';
import { DisclaimerPage } from '../disclaimer/disclaimer';
let TourPage = class TourPage {
    constructor(navCtrl, loadingCtrl, logger, translate, profileProvider, rateProvider, txFormatProvider, onGoingProcessProvider, persistenceProvider, popupProvider) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.logger = logger;
        this.translate = translate;
        this.profileProvider = profileProvider;
        this.rateProvider = rateProvider;
        this.txFormatProvider = txFormatProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.persistenceProvider = persistenceProvider;
        this.popupProvider = popupProvider;
        this.retryCount = 0;
        this.currentIndex = 0;
        this.rateProvider.whenRatesAvailable('btc').then(() => {
            let btcAmount = 1;
            this.localCurrencySymbol = '$';
            this.localCurrencyPerBtc = this.txFormatProvider.formatAlternativeStr('btc', btcAmount * 1e8);
        });
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad TourPage');
    }
    ionViewWillEnter() {
        this.navBar.backButtonClick = () => {
            this.slidePrev();
        };
    }
    slideChanged() {
        this.currentIndex = this.slides.getActiveIndex();
    }
    slidePrev() {
        if (this.currentIndex == 0)
            this.navCtrl.pop();
        else {
            this.slides.slidePrev();
        }
    }
    slideNext() {
        this.slides.slideNext();
    }
    createDefaultWallet() {
        this.onGoingProcessProvider.set('creatingWallet');
        this.profileProvider
            .createDefaultWallet()
            .then(wallet => {
            this.onGoingProcessProvider.clear();
            // this.persistenceProvider.setOnboardingCompleted();
            // this.navCtrl.push(CollectEmailPage, { walletId: wallet.id }); // **GCEdit: For ver 1.0, disabling it because we dont direct to CollectEmailPage
            this.navCtrl.push(DisclaimerPage, { walletId: wallet.id }); // **GCEdit: this walletId's value we are passing to BackupRequestPage was the error causing not to be able to get to the backup page because the id value was unidentified. MAKE SURE TO USE 'wallet.id' with LOWER "i"d. In the object data, there will be also 'walletId' key, but this can be only accessed as in "credentials.walletId" as it is in nexted object.
            // this.navCtrl.push(BackupRequestPage, { walletId: wallet.id }); if u need to go to the backuprequestpage use this instead
        })
            .catch(err => {
            setTimeout(() => {
                this.logger.warn('Retrying to create default wallet.....:' + this.retryCount);
                if (this.retryCount > 3) {
                    this.onGoingProcessProvider.clear();
                    let title = this.translate.instant('Cannot create wallet');
                    let okText = this.translate.instant('Retry');
                    this.popupProvider.ionicAlert(title, err, okText).then(() => {
                        this.retryCount = 0;
                        this.createDefaultWallet();
                    });
                }
                else {
                    this.createDefaultWallet();
                }
            }, 2000);
        });
    }
};
__decorate([
    ViewChild(Slides),
    __metadata("design:type", Slides)
], TourPage.prototype, "slides", void 0);
__decorate([
    ViewChild(Navbar),
    __metadata("design:type", Navbar)
], TourPage.prototype, "navBar", void 0);
TourPage = __decorate([
    Component({
        selector: 'page-tour',
        templateUrl: 'tour.html'
    }),
    __metadata("design:paramtypes", [NavController,
        LoadingController,
        Logger,
        TranslateService,
        ProfileProvider,
        RateProvider,
        TxFormatProvider,
        OnGoingProcessProvider,
        PersistenceProvider,
        PopupProvider])
], TourPage);
export { TourPage };
//# sourceMappingURL=tour.js.map