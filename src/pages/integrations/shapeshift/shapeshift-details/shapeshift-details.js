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
// Providers
import { ConfigProvider } from '../../../../providers/config/config';
import { ExternalLinkProvider } from '../../../../providers/external-link/external-link';
import { ShapeshiftProvider } from '../../../../providers/shapeshift/shapeshift';
let ShapeshiftDetailsPage = class ShapeshiftDetailsPage {
    constructor(configProvider, externalLinkProvider, navParams, shapeshiftProvider, viewCtrl, logger) {
        this.configProvider = configProvider;
        this.externalLinkProvider = externalLinkProvider;
        this.navParams = navParams;
        this.shapeshiftProvider = shapeshiftProvider;
        this.viewCtrl = viewCtrl;
        this.logger = logger;
        this.defaults = this.configProvider.getDefaults();
        this.ssData = this.navParams.data.ssData;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad ShapeshiftDetailsPage');
    }
    remove() {
        this.shapeshiftProvider.saveShapeshift(this.ssData, {
            remove: true
        }, () => {
            this.close();
        });
    }
    close() {
        this.viewCtrl.dismiss();
    }
    openTransaction(id) {
        var url;
        if (this.ssData.outgoingType.toUpperCase() == 'BTC') {
            url = 'https://' + this.defaults.blockExplorerUrl.btc + '/tx/' + id;
        }
        else if (this.ssData.outgoingType.toUpperCase() == 'BCH') {
            url = 'https://' + this.defaults.blockExplorerUrl.bch + '/tx/' + id;
        }
        else {
            return;
        }
        this.externalLinkProvider.open(url);
    }
};
ShapeshiftDetailsPage = __decorate([
    Component({
        selector: 'page-shapeshift-details',
        templateUrl: 'shapeshift-details.html'
    }),
    __metadata("design:paramtypes", [ConfigProvider,
        ExternalLinkProvider,
        NavParams,
        ShapeshiftProvider,
        ViewController,
        Logger])
], ShapeshiftDetailsPage);
export { ShapeshiftDetailsPage };
//# sourceMappingURL=shapeshift-details.js.map