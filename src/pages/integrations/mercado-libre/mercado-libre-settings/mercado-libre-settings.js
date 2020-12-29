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
import { ModalController } from 'ionic-angular';
import * as _ from 'lodash';
// Pages
import { MercadoLibreCardDetailsPage } from './../mercado-libre-card-details/mercado-libre-card-details';
// Providers
import { ConfigProvider } from '../../../../providers/config/config';
import { HomeIntegrationsProvider } from '../../../../providers/home-integrations/home-integrations';
import { Logger } from '../../../../providers/logger/logger';
import { MercadoLibreProvider } from '../../../../providers/mercado-libre/mercado-libre';
let MercadoLibreSettingsPage = class MercadoLibreSettingsPage {
    constructor(configProvider, homeIntegrationsProvider, logger, mercadoLibreProvider, modalCtrl) {
        this.configProvider = configProvider;
        this.homeIntegrationsProvider = homeIntegrationsProvider;
        this.logger = logger;
        this.mercadoLibreProvider = mercadoLibreProvider;
        this.modalCtrl = modalCtrl;
        this.serviceName = 'mercadolibre';
        this.service = _.filter(this.homeIntegrationsProvider.get(), {
            name: this.serviceName
        });
        this.showInHome = !!this.service[0].show;
        this.init();
    }
    init() {
        this.mercadoLibreProvider.getPendingGiftCards((err, gcds) => {
            if (err)
                this.logger.error(err);
            this.filterArchivedGiftCards(gcds);
            this.showArchivedCards = !_.isEmpty(this.archivedGiftCards);
        });
    }
    showInHomeSwitch() {
        let opts = {
            showIntegration: { [this.serviceName]: this.showInHome }
        };
        this.homeIntegrationsProvider.updateConfig(this.serviceName, this.showInHome);
        this.configProvider.set(opts);
    }
    filterArchivedGiftCards(giftCards) {
        this.archivedGiftCards = _.pickBy(giftCards, gcdValue => {
            return gcdValue.archived;
        });
    }
    openCardModal(card) {
        this.card = card;
        let modal = this.modalCtrl.create(MercadoLibreCardDetailsPage, {
            card: this.card
        });
        modal.present();
        modal.onDidDismiss(() => {
            this.init();
        });
    }
};
MercadoLibreSettingsPage = __decorate([
    Component({
        selector: 'page-mercado-libre-settings',
        templateUrl: 'mercado-libre-settings.html'
    }),
    __metadata("design:paramtypes", [ConfigProvider,
        HomeIntegrationsProvider,
        Logger,
        MercadoLibreProvider,
        ModalController])
], MercadoLibreSettingsPage);
export { MercadoLibreSettingsPage };
//# sourceMappingURL=mercado-libre-settings.js.map