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
import { Logger } from '../../../../../../providers/logger/logger';
// native
import { SocialSharing } from '@ionic-native/social-sharing';
// providers
import { AppProvider } from '../../../../../../providers/app/app';
import { OnGoingProcessProvider } from '../../../../../../providers/on-going-process/on-going-process';
import { PlatformProvider } from '../../../../../../providers/platform/platform';
let AllAddressesPage = class AllAddressesPage {
    constructor(navParams, viewCtrl, onGoingProcessProvider, socialSharing, appProvider, logger, platformProvider) {
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.socialSharing = socialSharing;
        this.appProvider = appProvider;
        this.logger = logger;
        this.platformProvider = platformProvider;
        this.walletName = this.navParams.data.walletName;
        this.noBalance = this.navParams.data.noBalance;
        this.withBalance = this.navParams.data.withBalance;
        this.coin = this.navParams.data.coin;
        this.allAddresses = this.noBalance.concat(this.withBalance);
        this.isCordova = this.platformProvider.isCordova;
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }
    formatDate(ts) {
        var dateObj = new Date(ts * 1000);
        if (!dateObj) {
            this.logger.debug('Error formating a date');
            return 'DateError';
        }
        if (!dateObj.toJSON()) {
            return '';
        }
        return dateObj.toJSON();
    }
    sendByEmail() {
        this.onGoingProcessProvider.set('sendingByEmail');
        setTimeout(() => {
            this.onGoingProcessProvider.clear();
            let appName = this.appProvider.info.nameCase;
            let body = appName +
                ' Wallet "' +
                this.walletName +
                '" Addresses\n  Only Main Addresses are  shown.\n\n';
            body += '\n';
            body += this.allAddresses
                .map(v => {
                return ('* ' +
                    v.address +
                    ' xpub' +
                    v.path.substring(1) +
                    ' ' +
                    this.formatDate(v.createdOn));
            })
                .join('\n');
            this.socialSharing.shareViaEmail(body, appName + ' Addresses', null, // TO: must be null or an array
            null, // CC: must be null or an array
            null, // BCC: must be null or an array
            null // FILES: can be null, a string, or an array
            );
        });
    }
};
AllAddressesPage = __decorate([
    Component({
        selector: 'page-all-addresses',
        templateUrl: 'all-addresses.html'
    }),
    __metadata("design:paramtypes", [NavParams,
        ViewController,
        OnGoingProcessProvider,
        SocialSharing,
        AppProvider,
        Logger,
        PlatformProvider])
], AllAddressesPage);
export { AllAddressesPage };
//# sourceMappingURL=all-addresses.js.map