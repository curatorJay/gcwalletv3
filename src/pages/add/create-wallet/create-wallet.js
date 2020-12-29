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
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// Pages
import { CopayersPage } from '../copayers/copayers';
// Providers
import { ConfigProvider } from '../../../providers/config/config';
import { DerivationPathHelperProvider } from '../../../providers/derivation-path-helper/derivation-path-helper';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../../providers/popup/popup';
import { ProfileProvider } from '../../../providers/profile/profile';
import { PushNotificationsProvider } from '../../../providers/push-notifications/push-notifications';
import { WalletProvider } from '../../../providers/wallet/wallet';
import * as _ from 'lodash';
let CreateWalletPage = class CreateWalletPage {
    constructor(navCtrl, navParams, fb, profileProvider, configProvider, derivationPathHelperProvider, popupProvider, onGoingProcessProvider, logger, walletProvider, translate, events, pushNotificationsProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.fb = fb;
        this.profileProvider = profileProvider;
        this.configProvider = configProvider;
        this.derivationPathHelperProvider = derivationPathHelperProvider;
        this.popupProvider = popupProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.logger = logger;
        this.walletProvider = walletProvider;
        this.translate = translate;
        this.events = events;
        this.pushNotificationsProvider = pushNotificationsProvider;
        /* For compressed keys, m*73 + n*34 <= 496 */
        this.COPAYER_PAIR_LIMITS = {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 4,
            6: 4,
            7: 3,
            8: 3,
            9: 2,
            10: 2,
            11: 1,
            12: 1
        };
        this.okText = this.translate.instant('Ok');
        this.cancelText = this.translate.instant('Cancel');
        this.isShared = this.navParams.get('isShared');
        this.title = this.isShared
            ? this.translate.instant('Create shared wallet')
            : this.translate.instant('Create personal wallet');
        this.defaults = this.configProvider.getDefaults();
        this.tc = this.isShared ? this.defaults.wallet.totalCopayers : 1;
        this.copayers = _.range(2, this.defaults.limits.totalCopayers + 1);
        this.derivationPathByDefault = this.derivationPathHelperProvider.default;
        this.derivationPathForTestnet = this.derivationPathHelperProvider.defaultTestnet;
        this.showAdvOpts = false;
        this.createForm = this.fb.group({
            walletName: [null, Validators.required],
            myName: [null],
            totalCopayers: [1],
            requiredCopayers: [1],
            bwsURL: [this.defaults.bws.url],
            selectedSeed: ['new'],
            recoveryPhrase: [null],
            derivationPath: [this.derivationPathByDefault],
            testnetEnabled: [false],
            singleAddress: [false],
            coin: [null, Validators.required]
        });
        this.setTotalCopayers(this.tc);
        this.updateRCSelect(this.tc);
    }
    ngOnInit() {
        if (this.isShared) {
            this.createForm.get('myName').setValidators([Validators.required]);
        }
    }
    setTotalCopayers(n) {
        this.createForm.controls['totalCopayers'].setValue(n);
        this.updateRCSelect(n);
        this.updateSeedSourceSelect();
    }
    updateRCSelect(n) {
        this.createForm.controls['totalCopayers'].setValue(n);
        var maxReq = this.COPAYER_PAIR_LIMITS[n];
        this.signatures = _.range(1, maxReq + 1);
        this.createForm.controls['requiredCopayers'].setValue(Math.min(Math.trunc(n / 2 + 1), maxReq));
    }
    updateSeedSourceSelect() {
        this.seedOptions = [
            {
                id: 'new',
                label: this.translate.instant('Random'),
                supportsTestnet: true
            },
            {
                id: 'set',
                label: this.translate.instant('Specify Recovery Phrase'),
                supportsTestnet: false
            }
        ];
        this.createForm.controls['selectedSeed'].setValue(this.seedOptions[0].id); // new or set
    }
    seedOptionsChange(seed) {
        if (seed === 'set') {
            this.createForm
                .get('recoveryPhrase')
                .setValidators([Validators.required]);
        }
        else {
            this.createForm.get('recoveryPhrase').setValidators(null);
        }
        this.createForm.controls['selectedSeed'].setValue(seed); // new or set
        if (this.createForm.controls['testnet'])
            this.createForm.controls['testnet'].setValue(false);
        this.createForm.controls['derivationPath'].setValue(this.derivationPathByDefault);
        this.createForm.controls['recoveryPhrase'].setValue(null);
    }
    setDerivationPath() {
        let path = this.createForm.value.testnet
            ? this.derivationPathForTestnet
            : this.derivationPathByDefault;
        this.createForm.controls['derivationPath'].setValue(path);
    }
    setOptsAndCreate() {
        let opts = {
            name: this.createForm.value.walletName,
            m: this.createForm.value.requiredCopayers,
            n: this.createForm.value.totalCopayers,
            myName: this.createForm.value.totalCopayers > 1
                ? this.createForm.value.myName
                : null,
            networkName: this.createForm.value.testnetEnabled ? 'testnet' : 'livenet',
            bwsurl: this.createForm.value.bwsURL,
            singleAddress: this.createForm.value.singleAddress,
            coin: this.createForm.value.coin
        };
        let setSeed = this.createForm.value.selectedSeed == 'set';
        if (setSeed) {
            let words = this.createForm.value.recoveryPhrase || '';
            if (words.indexOf(' ') == -1 &&
                words.indexOf('prv') == 1 &&
                words.length > 108) {
                opts.extendedPrivateKey = words;
            }
            else {
                opts.mnemonic = words;
            }
            let pathData = this.derivationPathHelperProvider.parse(this.createForm.value.derivationPath);
            if (!pathData) {
                let title = this.translate.instant('Error');
                let subtitle = this.translate.instant('Invalid derivation path');
                this.popupProvider.ionicAlert(title, subtitle);
                return;
            }
            opts.networkName = pathData.networkName;
            opts.derivationStrategy = pathData.derivationStrategy;
        }
        if (setSeed && !opts.mnemonic && !opts.extendedPrivateKey) {
            let title = this.translate.instant('Error');
            let subtitle = this.translate.instant('Please enter the wallet recovery phrase');
            this.popupProvider.ionicAlert(title, subtitle);
            return;
        }
        this.create(opts);
    }
    create(opts) {
        this.onGoingProcessProvider.set('creatingWallet');
        this.profileProvider
            .createWallet(opts)
            .then(wallet => {
            this.onGoingProcessProvider.clear();
            this.events.publish('status:updated');
            this.walletProvider.updateRemotePreferences(wallet);
            this.pushNotificationsProvider.updateSubscription(wallet);
            if (this.createForm.value.selectedSeed == 'set') {
                this.profileProvider.setBackupFlag(wallet.credentials.walletId);
            }
            if (!wallet.isComplete()) {
                this.navCtrl.popToRoot();
                this.navCtrl.push(CopayersPage, {
                    walletId: wallet.credentials.walletId
                });
            }
            else {
                this.navCtrl.popToRoot();
            }
        })
            .catch(err => {
            this.onGoingProcessProvider.clear();
            this.logger.error('Create: could not create wallet', err);
            let title = this.translate.instant('Error');
            this.popupProvider.ionicAlert(title, err);
            return;
        });
    }
};
CreateWalletPage = __decorate([
    Component({
        selector: 'page-create-wallet',
        templateUrl: 'create-wallet.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        FormBuilder,
        ProfileProvider,
        ConfigProvider,
        DerivationPathHelperProvider,
        PopupProvider,
        OnGoingProcessProvider,
        Logger,
        WalletProvider,
        TranslateService,
        Events,
        PushNotificationsProvider])
], CreateWalletPage);
export { CreateWalletPage };
//# sourceMappingURL=create-wallet.js.map