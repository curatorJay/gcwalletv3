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
import { TranslateService } from '@ngx-translate/core';
import { Logger } from '../../../providers/logger/logger';
// providers
import { AddressBookProvider } from '../../../providers/address-book/address-book';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { ProfileProvider } from '../../../providers/profile/profile';
let ProposalsPage = class ProposalsPage {
    constructor(onGoingProcessProvider, addressBookProvider, logger, profileProvider, translate) {
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.addressBookProvider = addressBookProvider;
        this.logger = logger;
        this.profileProvider = profileProvider;
        this.translate = translate;
    }
    ionViewWillEnter() {
        this.addressBookProvider
            .list()
            .then(ab => {
            this.addressbook = ab || {};
            let loading = this.translate.instant('Updating pending proposals... Please stand by');
            this.onGoingProcessProvider.set(loading);
            this.profileProvider
                .getTxps(50)
                .then(txpsData => {
                this.onGoingProcessProvider.clear();
                this.txps = txpsData.txps;
            })
                .catch(err => {
                this.onGoingProcessProvider.clear();
                this.logger.error(err);
            });
        })
            .catch(err => {
            this.logger.error(err);
        });
    }
};
ProposalsPage = __decorate([
    Component({
        selector: 'page-proposals',
        templateUrl: 'proposals.html'
    }),
    __metadata("design:paramtypes", [OnGoingProcessProvider,
        AddressBookProvider,
        Logger,
        ProfileProvider,
        TranslateService])
], ProposalsPage);
export { ProposalsPage };
//# sourceMappingURL=proposals.js.map