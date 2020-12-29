var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { Events, ModalController } from 'ionic-angular';
import { TimeProvider } from '../../../providers/time/time';
import { TxpDetailsPage } from '../../txp-details/txp-details';
let TxpPage = class TxpPage {
    constructor(timeProvider, events, modalCtrl) {
        this.timeProvider = timeProvider;
        this.events = events;
        this.modalCtrl = modalCtrl;
    }
    set tx(tx) {
        this._tx = tx;
    }
    get tx() {
        return this._tx;
    }
    set addressbook(addressbook) {
        this._addressbook = addressbook;
    }
    get addressbook() {
        return this._addressbook;
    }
    createdWithinPastDay(time) {
        return this.timeProvider.withinPastDay(time);
    }
    openTxpModal(txp) {
        let modal = this.modalCtrl.create(TxpDetailsPage, { tx: txp }, { showBackdrop: false, enableBackdropDismiss: false });
        modal.present();
        modal.onDidDismiss(() => {
            this.events.publish('status:updated');
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], TxpPage.prototype, "tx", null);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], TxpPage.prototype, "addressbook", null);
TxpPage = __decorate([
    Component({
        selector: 'page-txp',
        templateUrl: 'txp.html'
    }),
    __metadata("design:paramtypes", [TimeProvider,
        Events,
        ModalController])
], TxpPage);
export { TxpPage };
//# sourceMappingURL=txp.js.map