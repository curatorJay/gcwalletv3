var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Logger } from '../../providers/logger/logger';
// providers
import { OnGoingProcessProvider } from '../on-going-process/on-going-process';
import { ProfileProvider } from '../profile/profile';
let PayproProvider = class PayproProvider {
    constructor(profileProvider, logger, onGoingProcessProvider, translate) {
        this.profileProvider = profileProvider;
        this.logger = logger;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.translate = translate;
        this.logger.info('PayproProvider initialized');
    }
    getPayProDetails(uri, coin, disableLoader) {
        return new Promise((resolve, reject) => {
            let wallet = this.profileProvider.getWallets({
                onlyComplete: true,
                coin
            })[0];
            if (!wallet)
                return resolve();
            this.logger.debug('Fetch PayPro Request...', uri);
            if (disableLoader) {
                this.onGoingProcessProvider.set('');
            }
            else {
                this.onGoingProcessProvider.set('fetchingPayPro');
            }
            wallet.fetchPayPro({
                payProUrl: uri
            }, (err, paypro) => {
                this.onGoingProcessProvider.clear();
                if (err)
                    return reject(this.translate.instant('Could Not Fetch Payment: Check if it is still valid'));
                else if (!paypro.verified) {
                    this.logger.warn('Failed to verify payment protocol signatures');
                    return reject(this.translate.instant('Payment Protocol Invalid'));
                }
                return resolve(paypro);
            });
        });
    }
};
PayproProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ProfileProvider,
        Logger,
        OnGoingProcessProvider,
        TranslateService])
], PayproProvider);
export { PayproProvider };
//# sourceMappingURL=paypro.js.map