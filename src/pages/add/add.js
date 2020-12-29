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
// pages
import { CreateWalletPage } from './create-wallet/create-wallet';
import { ImportWalletPage } from './import-wallet/import-wallet';
import { JoinWalletPage } from './join-wallet/join-wallet';
let AddPage = class AddPage {
    constructor(navCtrl, logger) {
        this.navCtrl = navCtrl;
        this.logger = logger;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad AddPage');
    }
    goToCreateWallet(isShared) {
        this.navCtrl.push(CreateWalletPage, { isShared });
    }
    goToJoinWallet() {
        this.navCtrl.push(JoinWalletPage);
    }
    goToImportWallet() {
        this.navCtrl.push(ImportWalletPage);
    }
};
AddPage = __decorate([
    Component({
        selector: 'page-add',
        templateUrl: 'add.html'
    }),
    __metadata("design:paramtypes", [NavController, Logger])
], AddPage);
export { AddPage };
//# sourceMappingURL=add.js.map