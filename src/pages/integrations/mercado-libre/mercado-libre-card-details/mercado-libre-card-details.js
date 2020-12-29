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
import { Logger } from '../../../../providers/logger/logger';
// Provider
import { ExternalLinkProvider } from '../../../../providers/external-link/external-link';
import { MercadoLibreProvider } from '../../../../providers/mercado-libre/mercado-libre';
import { TimeProvider } from '../../../../providers/time/time';
let MercadoLibreCardDetailsPage = class MercadoLibreCardDetailsPage {
    constructor(mercadoLibreProvider, logger, externalLinkProvider, navParams, viewCtrl, timeProvider) {
        this.mercadoLibreProvider = mercadoLibreProvider;
        this.logger = logger;
        this.externalLinkProvider = externalLinkProvider;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.timeProvider = timeProvider;
        this.card = this.navParams.data.card;
        this.isOldCard = !this.timeProvider.withinPastDay(this.card.date);
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad MercadoLibreCardDetailsPage');
    }
    remove() {
        this.mercadoLibreProvider.savePendingGiftCard(this.card, {
            remove: true
        }, () => {
            this.close();
        });
    }
    archive() {
        this.mercadoLibreProvider.savePendingGiftCard(this.card, {
            archived: true
        }, () => {
            this.logger.debug('Mercado Libre Gift Card archived');
            this.close();
        });
    }
    close() {
        this.viewCtrl.dismiss();
    }
    openExternalLink(url) {
        this.externalLinkProvider.open(url);
    }
    openRedeemLink() {
        const url = this.mercadoLibreProvider.getNetwork() === 'testnet'
            ? 'https://beta.mercadolivre.com.br/vale-presente/resgate'
            : 'https://www.mercadolivre.com.br/vale-presente/resgate';
        this.openExternalLink(url);
    }
    openSupportWebsite() {
        let url = 'https://help.bitpay.com/requestHelp';
        let optIn = true;
        let title = null;
        let message = 'A informação de ajuda e suporte está disponível no site.';
        let okText = 'Abrir';
        let cancelText = 'Volte';
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
};
MercadoLibreCardDetailsPage = __decorate([
    Component({
        selector: 'page-mercado-libre-card-details',
        templateUrl: 'mercado-libre-card-details.html'
    }),
    __metadata("design:paramtypes", [MercadoLibreProvider,
        Logger,
        ExternalLinkProvider,
        NavParams,
        ViewController,
        TimeProvider])
], MercadoLibreCardDetailsPage);
export { MercadoLibreCardDetailsPage };
//# sourceMappingURL=mercado-libre-card-details.js.map