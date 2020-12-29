var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../../../providers/logger/logger';
// providers
import { BwcErrorProvider } from '../../../../../providers/bwc-error/bwc-error';
import { OnGoingProcessProvider } from '../../../../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../../../../providers/popup/popup';
import { ProfileProvider } from '../../../../../providers/profile/profile';
import { TxFormatProvider } from '../../../../../providers/tx-format/tx-format';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
// pages
import { WalletDetailsPage } from '../../../../../pages/wallet-details/wallet-details';
import { AllAddressesPage } from './all-addresses/all-addresses';
import * as _ from 'lodash';
let WalletAddressesPage = class WalletAddressesPage {
    constructor(profileProvider, walletProvider, navCtrl, navParams, logger, bwcErrorProvider, popupProvider, onGoingProcessProvider, modalCtrl, txFormatProvider, translate) {
        this.profileProvider = profileProvider;
        this.walletProvider = walletProvider;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.logger = logger;
        this.bwcErrorProvider = bwcErrorProvider;
        this.popupProvider = popupProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.modalCtrl = modalCtrl;
        this.txFormatProvider = txFormatProvider;
        this.translate = translate;
        this.UNUSED_ADDRESS_LIMIT = 5;
        this.BALANCE_ADDRESS_LIMIT = 5;
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.withBalance = null;
        this.noBalance = null;
    }
    ionViewWillEnter() {
        this.loading = true;
        this.walletProvider
            .getMainAddresses(this.wallet, {})
            .then(allAddresses => {
            this.walletProvider
                .getBalance(this.wallet, {})
                .then(resp => {
                this.withBalance = resp.byAddress;
                var idx = _.keyBy(this.withBalance, 'address');
                this.noBalance = _.reject(allAddresses, x => {
                    return idx[x.address];
                });
                this.processList(this.noBalance);
                this.processList(this.withBalance);
                this.latestUnused = _.slice(this.noBalance, 0, this.UNUSED_ADDRESS_LIMIT);
                this.latestWithBalance = _.slice(this.withBalance, 0, this.BALANCE_ADDRESS_LIMIT);
                this.viewAll =
                    this.noBalance.length > this.UNUSED_ADDRESS_LIMIT ||
                        this.withBalance.length > this.BALANCE_ADDRESS_LIMIT;
                this.loading = false;
            })
                .catch(err => {
                this.logger.error(err);
                this.loading = false;
                this.popupProvider.ionicAlert(this.bwcErrorProvider.msg(err, this.translate.instant('Could not update wallet')));
            });
        })
            .catch(err => {
            this.logger.error(err);
            this.loading = false;
            this.popupProvider.ionicAlert(this.bwcErrorProvider.msg(err, this.translate.instant('Could not update wallet')));
        });
        this.walletProvider
            .getLowUtxos(this.wallet)
            .then(resp => {
            if (resp && resp.allUtxos && resp.allUtxos.length) {
                let allSum = _.sumBy(resp.allUtxos || 0, 'satoshis');
                let per = (resp.minFee / allSum) * 100;
                this.lowUtxosNb = resp.lowUtxos.length;
                this.allUtxosNb = resp.allUtxos.length;
                this.lowUtxosSum = this.txFormatProvider.formatAmountStr(this.wallet.coin, _.sumBy(resp.lowUtxos || 0, 'satoshis'));
                this.allUtxosSum = this.txFormatProvider.formatAmountStr(this.wallet.coin, allSum);
                this.minFee = this.txFormatProvider.formatAmountStr(this.wallet.coin, resp.minFee || 0);
                this.minFeePer = per.toFixed(2) + '%';
            }
        })
            .catch(err => {
            this.logger.warn('GetLowUtxos', err);
        });
    }
    processList(list) {
        _.each(list, n => {
            n.path = n.path ? n.path.replace(/^m/g, 'xpub') : null;
            n.address = this.walletProvider.getAddressView(this.wallet, n.address);
        });
    }
    newAddress() {
        if (this.gapReached)
            return;
        this.onGoingProcessProvider.set('generatingNewAddress');
        this.walletProvider
            .getAddress(this.wallet, true)
            .then((addr) => {
            this.walletProvider
                .getMainAddresses(this.wallet, { limit: 1 })
                .then(_addr => {
                this.onGoingProcessProvider.clear();
                if (addr != _addr[0].address) {
                    this.popupProvider.ionicAlert(this.translate.instant('Error'), this.translate.instant('New address could not be generated. Please try again.'));
                    return;
                }
                this.noBalance = [_addr[0]].concat(this.noBalance);
                this.processList(this.noBalance);
                this.latestUnused = _.slice(this.noBalance, 0, this.UNUSED_ADDRESS_LIMIT);
                this.viewAll = this.noBalance.length > this.UNUSED_ADDRESS_LIMIT;
            })
                .catch(err => {
                this.logger.error(err);
                this.onGoingProcessProvider.clear();
                this.popupProvider.ionicAlert(this.translate.instant('Error'), err);
            });
        })
            .catch(err => {
            this.logger.error(err);
            this.onGoingProcessProvider.clear();
            if (err.toString().match('MAIN_ADDRESS_GAP_REACHED')) {
                this.gapReached = true;
            }
            else {
                this.popupProvider.ionicAlert('Error', err);
            }
        });
    }
    viewAllAddresses() {
        let modal = this.modalCtrl.create(AllAddressesPage, {
            noBalance: this.noBalance,
            withBalance: this.withBalance,
            coin: this.wallet.coin,
            walletName: this.wallet.name
        });
        modal.present();
    }
    scan() {
        return __awaiter(this, void 0, void 0, function* () {
            this.walletProvider.startScan(this.wallet);
            yield this.navCtrl.popToRoot({ animate: false });
            yield this.navCtrl.parent.select(0);
            yield this.navCtrl.push(WalletDetailsPage, {
                walletId: this.wallet.credentials.walletId
            });
        });
    }
};
WalletAddressesPage = __decorate([
    Component({
        selector: 'page-wallet-addresses',
        templateUrl: 'wallet-addresses.html'
    }),
    __metadata("design:paramtypes", [ProfileProvider,
        WalletProvider,
        NavController,
        NavParams,
        Logger,
        BwcErrorProvider,
        PopupProvider,
        OnGoingProcessProvider,
        ModalController,
        TxFormatProvider,
        TranslateService])
], WalletAddressesPage);
export { WalletAddressesPage };
//# sourceMappingURL=wallet-addresses.js.map