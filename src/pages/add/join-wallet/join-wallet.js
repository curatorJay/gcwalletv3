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
let JoinWalletPage = class JoinWalletPage {
    constructor(configProvider, form, navCtrl, navParams, derivationPathHelperProvider, onGoingProcessProvider, popupProvider, profileProvider, walletProvider, logger, translate, events, pushNotificationsProvider) {
        this.configProvider = configProvider;
        this.form = form;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.derivationPathHelperProvider = derivationPathHelperProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.popupProvider = popupProvider;
        this.profileProvider = profileProvider;
        this.walletProvider = walletProvider;
        this.logger = logger;
        this.translate = translate;
        this.events = events;
        this.pushNotificationsProvider = pushNotificationsProvider;
        this.okText = this.translate.instant('Ok');
        this.cancelText = this.translate.instant('Cancel');
        this.defaults = this.configProvider.getDefaults();
        this.derivationPathByDefault = this.derivationPathHelperProvider.default;
        this.derivationPathForTestnet = this.derivationPathHelperProvider.defaultTestnet;
        this.showAdvOpts = false;
        let regex = /^[0-9A-HJ-NP-Za-km-z]{70,80}$/; // For invitationCode
        this.joinForm = this.form.group({
            myName: [null, Validators.required],
            invitationCode: [null, [Validators.required, Validators.pattern(regex)]],
            bwsURL: [this.defaults.bws.url],
            selectedSeed: ['new'],
            recoveryPhrase: [null],
            derivationPath: [this.derivationPathByDefault],
            coin: [null, Validators.required]
        });
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
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad JoinWalletPage');
    }
    ionViewWillEnter() {
        if (this.navParams.data.url) {
            let data = this.navParams.data.url;
            data = data.replace('getcoins:', '');
            this.onQrCodeScannedJoin(data);
        }
    }
    onQrCodeScannedJoin(data) {
        // TODO
        this.joinForm.controls['invitationCode'].setValue(data);
    }
    seedOptionsChange(seed) {
        if (seed === 'set') {
            this.joinForm.get('recoveryPhrase').setValidators([Validators.required]);
        }
        else {
            this.joinForm.get('recoveryPhrase').setValidators(null);
        }
        this.joinForm.controls['selectedSeed'].setValue(seed);
        this.joinForm.controls['testnet'].setValue(false);
        this.joinForm.controls['derivationPath'].setValue(this.derivationPathByDefault);
    }
    setDerivationPath() {
        let path = this.joinForm.value.testnet
            ? this.derivationPathForTestnet
            : this.derivationPathByDefault;
        this.joinForm.controls['derivationPath'].setValue(path);
    }
    setOptsAndJoin() {
        let opts = {
            secret: this.joinForm.value.invitationCode,
            myName: this.joinForm.value.myName,
            bwsurl: this.joinForm.value.bwsURL,
            coin: this.joinForm.value.coin
        };
        let setSeed = this.joinForm.value.selectedSeed == 'set';
        if (setSeed) {
            let words = this.joinForm.value.recoveryPhrase;
            if (words.indexOf(' ') == -1 &&
                words.indexOf('prv') == 1 &&
                words.length > 108) {
                opts.extendedPrivateKey = words;
            }
            else {
                opts.mnemonic = words;
            }
            let pathData = this.derivationPathHelperProvider.parse(this.joinForm.value.derivationPath);
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
        this.join(opts);
    }
    join(opts) {
        this.onGoingProcessProvider.set('joiningWallet');
        this.profileProvider
            .joinWallet(opts)
            .then(wallet => {
            this.onGoingProcessProvider.clear();
            this.events.publish('status:updated');
            this.walletProvider.updateRemotePreferences(wallet);
            this.pushNotificationsProvider.updateSubscription(wallet);
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
            let title = this.translate.instant('Error');
            this.popupProvider.ionicAlert(title, err);
            return;
        });
    }
    openScanner() {
        if (this.navParams.data.fromScan) {
            this.navCtrl.popToRoot({ animate: false });
        }
        else {
            this.navCtrl.popToRoot({ animate: false }).then(() => {
                this.navCtrl.parent.select(2);
            });
        }
    }
};
JoinWalletPage = __decorate([
    Component({
        selector: 'page-join-wallet',
        templateUrl: 'join-wallet.html'
    }),
    __metadata("design:paramtypes", [ConfigProvider,
        FormBuilder,
        NavController,
        NavParams,
        DerivationPathHelperProvider,
        OnGoingProcessProvider,
        PopupProvider,
        ProfileProvider,
        WalletProvider,
        Logger,
        TranslateService,
        Events,
        PushNotificationsProvider])
], JoinWalletPage);
export { JoinWalletPage };
//# sourceMappingURL=join-wallet.js.map