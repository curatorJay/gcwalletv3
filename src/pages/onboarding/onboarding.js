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
import { NavController } from 'ionic-angular';
import { Logger } from '../../providers/logger/logger';
// providers
import { AppProvider } from '../../providers/app/app';
import { ImportWalletPage } from '../add/import-wallet/import-wallet';
import { TourPage } from './tour/tour';
let OnboardingPage = class OnboardingPage {
    constructor(navCtrl, logger, app) {
        this.navCtrl = navCtrl;
        this.logger = logger;
        this.app = app;
        this.isGetCoins = this.app.info.nameCase == 'GetCoins' ? true : false;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad OnboardingPage');
    }
    getStarted() {
        this.navCtrl.push(TourPage);
    }
    restoreFromBackup() {
        this.navCtrl.push(ImportWalletPage, { fromOnboarding: true });
    }
};
OnboardingPage = __decorate([
    Component({
        selector: 'page-onboarding',
        templateUrl: 'onboarding.html'
    }),
    __metadata("design:paramtypes", [NavController,
        Logger,
        AppProvider])
], OnboardingPage);
export { OnboardingPage };
//# sourceMappingURL=onboarding.js.map