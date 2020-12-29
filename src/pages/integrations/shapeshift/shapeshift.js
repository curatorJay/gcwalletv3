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
import { Events, ModalController, NavController } from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from '../../../providers/logger/logger';
// Pages
import { ShapeshiftDetailsPage } from './shapeshift-details/shapeshift-details';
import { ShapeshiftShiftPage } from './shapeshift-shift/shapeshift-shift';
// Providers
import { ExternalLinkProvider } from '../../../providers/external-link/external-link';
import { ShapeshiftProvider } from '../../../providers/shapeshift/shapeshift';
import { TimeProvider } from '../../../providers/time/time';
let ShapeshiftPage = class ShapeshiftPage {
    constructor(events, externalLinkProvider, logger, modalCtrl, navCtrl, shapeshiftProvider, timeProvider) {
        this.events = events;
        this.externalLinkProvider = externalLinkProvider;
        this.logger = logger;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.shapeshiftProvider = shapeshiftProvider;
        this.timeProvider = timeProvider;
        this.updateShift = _.debounce(shifts => {
            if (_.isEmpty(shifts.data))
                return;
            _.forEach(shifts.data, dataFromStorage => {
                if (!this.checkIfShiftNeedsUpdate(dataFromStorage))
                    return;
                this.shapeshiftProvider.getStatus(dataFromStorage.address, (err, st) => {
                    if (err)
                        return;
                    this.shifts.data[st.address].status = st.status;
                    this.shifts.data[st.address].transaction = st.transaction || null;
                    this.shifts.data[st.address].incomingCoin = st.incomingCoin || null;
                    this.shifts.data[st.address].incomingType = st.incomingType || null;
                    this.shifts.data[st.address].outgoingCoin = st.outgoingCoin || null;
                    this.shifts.data[st.address].outgoingType = st.outgoingType || null;
                    this.shapeshiftProvider.saveShapeshift(this.shifts.data[st.address], null, () => {
                        this.logger.debug('Saved shift with status: ' + st.status);
                    });
                });
            });
        }, 1000, {
            leading: true
        });
        this.network = this.shapeshiftProvider.getNetwork();
        this.shifts = { data: {} };
        this.init();
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad ShapeshiftPage');
    }
    ionViewWillEnter() {
        this.events.subscribe('bwsEvent', (_, type) => {
            if (type == 'NewBlock')
                this.updateShift(this.shifts);
        });
    }
    ionViewWillLeave() {
        this.events.unsubscribe('bwsEvent');
    }
    openExternalLink(url) {
        this.externalLinkProvider.open(url);
    }
    checkIfShiftNeedsUpdate(shiftData) {
        // Continues normal flow (update shiftData)
        if (shiftData.status == 'received') {
            return true;
        }
        // Check if shiftData status FAILURE for 24 hours
        if ((shiftData.status == 'failed' || shiftData.status == 'no_deposits') &&
            this.timeProvider.withinPastDay(shiftData.date)) {
            return true;
        }
        // If status is complete: do not update
        // If status fails or do not receive deposits for more than 24 hours: do not update
        return false;
    }
    init() {
        this.shapeshiftProvider.getShapeshift((err, ss) => {
            if (err)
                this.logger.error(err);
            if (ss)
                this.shifts = { data: ss };
            this.updateShift(this.shifts);
        });
    }
    update() {
        this.updateShift(this.shifts);
    }
    openShiftModal(ssData) {
        let modal = this.modalCtrl.create(ShapeshiftDetailsPage, { ssData });
        modal.present();
        modal.onDidDismiss(() => {
            this.init();
        });
    }
    goTo(page) {
        switch (page) {
            case 'Shift':
                this.navCtrl.push(ShapeshiftShiftPage);
                break;
        }
    }
};
ShapeshiftPage = __decorate([
    Component({
        selector: 'page-shapeshift',
        templateUrl: 'shapeshift.html'
    }),
    __metadata("design:paramtypes", [Events,
        ExternalLinkProvider,
        Logger,
        ModalController,
        NavController,
        ShapeshiftProvider,
        TimeProvider])
], ShapeshiftPage);
export { ShapeshiftPage };
//# sourceMappingURL=shapeshift.js.map