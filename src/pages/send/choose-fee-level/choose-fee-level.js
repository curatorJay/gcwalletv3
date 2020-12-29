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
import { ViewController } from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from '../../../providers/logger/logger';
// Providers
import { FeeProvider } from '../../../providers/fee/fee';
import { PopupProvider } from '../../../providers/popup/popup';
let ChooseFeeLevelPage = class ChooseFeeLevelPage {
    constructor(viewCtrl, logger, popupProvider, feeProvider, translate) {
        this.viewCtrl = viewCtrl;
        this.logger = logger;
        this.popupProvider = popupProvider;
        this.feeProvider = feeProvider;
        this.translate = translate;
        this.FEE_MULTIPLIER = 10;
        this.FEE_MIN = 0;
        this.okText = this.translate.instant('Ok');
        this.cancelText = this.translate.instant('Cancel');
        // From parent controller
        this.network = this.viewCtrl.data.network;
        this.feeLevel = this.viewCtrl.data.feeLevel;
        // IF usingCustomFee
        this.customFeePerKB = this.viewCtrl.data.customFeePerKB
            ? this.viewCtrl.data.customFeePerKB
            : null;
        this.feePerSatByte = this.viewCtrl.data.feePerSatByte
            ? this.viewCtrl.data.feePerSatByte
            : null;
        if (_.isEmpty(this.feeLevel))
            this.showErrorAndClose(null, this.translate.instant('Fee level is not defined'));
        this.selectedFee = this.feeLevel;
        this.feeOpts = Object.keys(this.feeProvider.getFeeOpts());
        this.loadingFee = true;
        this.feeProvider
            .getFeeLevels(this.coin)
            .then(levels => {
            this.loadingFee = false;
            if (_.isEmpty(levels)) {
                this.showErrorAndClose(null, this.translate.instant('Could not get fee levels'));
                return;
            }
            this.feeLevels = levels;
            this.updateFeeRate();
        })
            .catch(err => {
            this.loadingFee = false;
            this.showErrorAndClose(null, err);
            return;
        });
    }
    showErrorAndClose(title, msg) {
        title = title ? title : this.translate.instant('Error');
        this.logger.error(msg);
        this.popupProvider.ionicAlert(title, msg).then(() => {
            this.viewCtrl.dismiss();
        });
    }
    updateFeeRate() {
        let value = _.find(this.feeLevels.levels[this.network], feeLevel => {
            return feeLevel.level == this.feeLevel;
        });
        // If no custom fee
        if (value) {
            this.customFeePerKB = null;
            this.feePerSatByte = (value.feePerKb / 1000).toFixed();
            this.avgConfirmationTime = value.nbBlocks * 10;
        }
        else {
            this.avgConfirmationTime = null;
            this.customSatPerByte = Number(this.feePerSatByte);
            this.customFeePerKB = (+this.feePerSatByte * 1000).toFixed();
        }
        // Warnings
        this.setFeesRecommended();
        this.checkFees(this.feePerSatByte);
    }
    setFeesRecommended() {
        this.maxFeeRecommended = this.getMaxRecommended();
        this.minFeeRecommended = this.getMinRecommended();
        this.minFeeAllowed = this.FEE_MIN;
        this.maxFeeAllowed = this.maxFeeRecommended * this.FEE_MULTIPLIER;
        this.maxFee =
            this.maxFeeRecommended > this.maxFeeAllowed
                ? this.maxFeeRecommended
                : this.maxFeeAllowed;
        this.minFee =
            this.minFeeRecommended < this.minFeeAllowed
                ? this.minFeeRecommended
                : this.minFeeAllowed;
    }
    getMinRecommended() {
        let value = _.find(this.feeLevels.levels[this.network], feeLevel => {
            return feeLevel.level == 'superEconomy';
        });
        return parseInt((value.feePerKb / 1000).toFixed(), 10);
    }
    getMaxRecommended() {
        let value = _.find(this.feeLevels.levels[this.network], feeLevel => {
            return feeLevel.level == 'urgent';
        });
        return parseInt((value.feePerKb / 1000).toFixed(), 10);
    }
    checkFees(feePerSatByte) {
        let fee = Number(feePerSatByte);
        this.showError = fee <= this.minFeeAllowed ? true : false;
        this.showMinWarning =
            fee > this.minFeeAllowed && fee < this.minFeeRecommended ? true : false;
        this.showMaxWarning =
            fee < this.maxFeeAllowed && fee > this.maxFeeRecommended ? true : false;
    }
    ok() {
        this.customFeePerKB = this.customFeePerKB
            ? (this.customSatPerByte * 1000).toFixed()
            : null;
        this.viewCtrl.dismiss({
            newFeeLevel: this.feeLevel,
            customFeePerKB: this.customFeePerKB
        });
    }
    cancel() {
        this.viewCtrl.dismiss();
    }
    changeSelectedFee(newFeeLevelValue) {
        if (this.feeLevel != newFeeLevelValue) {
            this.logger.debug('New fee level: ' + newFeeLevelValue);
            this.feeLevel = newFeeLevelValue;
            this.updateFeeRate();
        }
    }
};
ChooseFeeLevelPage = __decorate([
    Component({
        selector: 'page-choose-fee-level',
        templateUrl: 'choose-fee-level.html'
    }),
    __metadata("design:paramtypes", [ViewController,
        Logger,
        PopupProvider,
        FeeProvider,
        TranslateService])
], ChooseFeeLevelPage);
export { ChooseFeeLevelPage };
//# sourceMappingURL=choose-fee-level.js.map