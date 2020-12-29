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
import { App, Events, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// Pages
import { DisclaimerPage } from '../../onboarding/disclaimer/disclaimer';
import { TabsPage } from '../../tabs/tabs';
// Providers
import { BwcProvider } from '../../../providers/bwc/bwc';
import { ConfigProvider } from '../../../providers/config/config';
import { DerivationPathHelperProvider } from '../../../providers/derivation-path-helper/derivation-path-helper';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PlatformProvider } from '../../../providers/platform/platform';
import { PopupProvider } from '../../../providers/popup/popup';
import { ProfileProvider } from '../../../providers/profile/profile';
import { PushNotificationsProvider } from '../../../providers/push-notifications/push-notifications';
import { WalletProvider } from '../../../providers/wallet/wallet';
let ImportWalletPage = class ImportWalletPage {
    constructor(app, navCtrl, navParams, form, bwcProvider, derivationPathHelperProvider, walletProvider, configProvider, popupProvider, platformProvider, logger, onGoingProcessProvider, profileProvider, translate, events, pushNotificationsProvider) {
        this.app = app;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.form = form;
        this.bwcProvider = bwcProvider;
        this.derivationPathHelperProvider = derivationPathHelperProvider;
        this.walletProvider = walletProvider;
        this.configProvider = configProvider;
        this.popupProvider = popupProvider;
        this.platformProvider = platformProvider;
        this.logger = logger;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.profileProvider = profileProvider;
        this.translate = translate;
        this.events = events;
        this.pushNotificationsProvider = pushNotificationsProvider;
        this.okText = this.translate.instant('Ok');
        this.cancelText = this.translate.instant('Cancel');
        this.reader = new FileReader();
        this.defaults = this.configProvider.getDefaults();
        this.errors = bwcProvider.getErrors();
        this.isCordova = this.platformProvider.isCordova;
        this.isSafari = this.platformProvider.isSafari;
        this.isIOS = this.platformProvider.isIOS;
        this.importErr = false;
        this.fromOnboarding = this.navParams.data.fromOnboarding;
        this.code = this.navParams.data.code;
        this.selectedTab = 'words';
        this.derivationPathByDefault = this.derivationPathHelperProvider.default;
        this.derivationPathForTestnet = this.derivationPathHelperProvider.defaultTestnet;
        this.showAdvOpts = false;
        this.formFile = null;
        this.importForm = this.form.group({
            words: [null, Validators.required],
            backupText: [null],
            passphrase: [null],
            file: [null],
            filePassword: [null],
            derivationPath: [this.derivationPathByDefault, Validators.required],
            testnetEnabled: [false],
            bwsURL: [this.defaults.bws.url],
            coin: [null, Validators.required]
        });
    }
    ionViewWillEnter() {
        if (this.code) {
            this.processWalletInfo(this.code);
        }
    }
    selectTab(tab) {
        this.selectedTab = tab;
        switch (tab) {
            case 'words':
                this.file = null;
                this.formFile = null;
                this.importForm.get('words').setValidators([Validators.required]);
                this.importForm.get('coin').setValidators([Validators.required]);
                this.importForm.get('filePassword').clearValidators();
                if (this.isCordova || this.isSafari)
                    this.importForm.get('backupText').clearValidators();
                else
                    this.importForm.get('file').clearValidators();
                break;
            case 'file':
                if (this.isCordova || this.isSafari)
                    this.importForm
                        .get('backupText')
                        .setValidators([Validators.required]);
                else
                    this.importForm.get('file').setValidators([Validators.required]);
                this.importForm
                    .get('filePassword')
                    .setValidators([Validators.required]);
                this.importForm.get('words').clearValidators();
                this.importForm.get('coin').clearValidators();
                break;
            default:
                this.importForm.get('words').clearValidators();
                this.importForm.get('file').clearValidators();
                this.importForm.get('filePassword').clearValidators();
                break;
        }
        this.importForm.get('words').updateValueAndValidity();
        this.importForm.get('file').updateValueAndValidity();
        this.importForm.get('filePassword').updateValueAndValidity();
        this.importForm.get('backupText').updateValueAndValidity();
        this.importForm.get('coin').updateValueAndValidity();
    }
    normalizeMnemonic(words) {
        if (!words || !words.indexOf)
            return words;
        var isJA = words.indexOf('\u3000') > -1;
        var wordList = words.split(/[\u3000\s]+/);
        return wordList.join(isJA ? '\u3000' : ' ');
    }
    processWalletInfo(code) {
        if (!code)
            return;
        this.importErr = false;
        let parsedCode = code.split('|');
        let info = {
            type: parsedCode[0],
            data: parsedCode[1],
            network: parsedCode[2],
            derivationPath: parsedCode[3],
            hasPassphrase: parsedCode[4] == 'true' ? true : false,
            coin: parsedCode[5]
        };
        if (info.type == '1' && info.hasPassphrase) {
            let title = this.translate.instant('Error');
            let subtitle = this.translate.instant('Password required. Make sure to enter your password in advanced options');
            this.popupProvider.ionicAlert(title, subtitle);
        }
        let isTestnet = info.network == 'testnet' ? true : false;
        this.importForm.controls['testnetEnabled'].setValue(isTestnet);
        this.importForm.controls['derivationPath'].setValue(info.derivationPath);
        this.importForm.controls['words'].setValue(info.data);
        this.importForm.controls['coin'].setValue(info.coin);
    }
    setDerivationPath() {
        let path = this.importForm.value.testnetEnabled
            ? this.derivationPathForTestnet
            : this.derivationPathByDefault;
        this.importForm.controls['derivationPath'].setValue(path);
    }
    importBlob(str, opts) {
        let str2;
        let err = null;
        try {
            str2 = this.bwcProvider
                .getSJCL()
                .decrypt(this.importForm.value.filePassword, str);
        }
        catch (e) {
            err = this.translate.instant('Could not decrypt file, check your password');
            this.logger.error('Import: could not decrypt file', e);
        }
        if (err) {
            let title = this.translate.instant('Error');
            this.popupProvider.ionicAlert(title, err);
            return;
        }
        this.onGoingProcessProvider.set('importingWallet');
        opts.compressed = null;
        opts.password = null;
        setTimeout(() => {
            this.profileProvider
                .importWallet(str2, opts)
                .then(wallet => {
                this.onGoingProcessProvider.clear();
                this.finish(wallet);
            })
                .catch(err => {
                this.onGoingProcessProvider.clear();
                let title = this.translate.instant('Error');
                this.popupProvider.ionicAlert(title, err);
                return;
            });
        }, 100);
    }
    finish(wallet) {
        this.walletProvider
            .updateRemotePreferences(wallet)
            .then(() => {
            this.profileProvider.setBackupFlag(wallet.credentials.walletId);
            this.events.publish('status:updated');
            this.pushNotificationsProvider.updateSubscription(wallet);
            if (this.fromOnboarding) {
                this.profileProvider.setOnboardingCompleted();
                this.navCtrl.push(DisclaimerPage);
            }
            else {
                this.app.getRootNavs()[0].setRoot(TabsPage);
            }
        })
            .catch(err => {
            this.logger.error('Import: could not updateRemotePreferences', err);
        });
    }
    importExtendedPrivateKey(xPrivKey, opts) {
        this.onGoingProcessProvider.set('importingWallet');
        setTimeout(() => {
            this.profileProvider
                .importExtendedPrivateKey(xPrivKey, opts)
                .then(wallet => {
                this.onGoingProcessProvider.clear();
                this.finish(wallet);
            })
                .catch(err => {
                if (err instanceof this.errors.NOT_AUTHORIZED) {
                    this.importErr = true;
                }
                else {
                    let title = this.translate.instant('Error');
                    this.popupProvider.ionicAlert(title, err);
                }
                this.onGoingProcessProvider.clear();
                return;
            });
        }, 100);
    }
    importMnemonic(words, opts) {
        this.onGoingProcessProvider.set('importingWallet');
        setTimeout(() => {
            this.profileProvider
                .importMnemonic(words, opts)
                .then(wallet => {
                this.onGoingProcessProvider.clear();
                this.finish(wallet);
            })
                .catch(err => {
                if (err instanceof this.errors.NOT_AUTHORIZED) {
                    this.importErr = true;
                }
                else {
                    let title = this.translate.instant('Error');
                    this.popupProvider.ionicAlert(title, err);
                }
                this.onGoingProcessProvider.clear();
                return;
            });
        }, 100);
    }
    import() {
        if (this.selectedTab === 'file') {
            this.importFromFile();
        }
        else {
            this.importFromMnemonic();
        }
    }
    importFromFile() {
        if (!this.importForm.valid) {
            let title = this.translate.instant('Error');
            let subtitle = this.translate.instant('There is an error in the form');
            this.popupProvider.ionicAlert(title, subtitle);
            return;
        }
        let backupFile = this.file;
        let backupText = this.importForm.value.backupText;
        if (!backupFile && !backupText) {
            let title = this.translate.instant('Error');
            let subtitle = this.translate.instant('Please, select your backup file');
            this.popupProvider.ionicAlert(title, subtitle);
            return;
        }
        if (backupFile) {
            this.reader.readAsBinaryString(backupFile);
        }
        else {
            let opts = {};
            opts.bwsurl = this.importForm.value.bwsURL;
            opts.coin = this.importForm.value.coin;
            this.importBlob(backupText, opts);
        }
    }
    importFromMnemonic() {
        if (!this.importForm.valid) {
            let title = this.translate.instant('Error');
            let subtitle = this.translate.instant('There is an error in the form');
            this.popupProvider.ionicAlert(title, subtitle);
            return;
        }
        let opts = {};
        if (this.importForm.value.bwsURL)
            opts.bwsurl = this.importForm.value.bwsURL;
        let pathData = this.derivationPathHelperProvider.parse(this.importForm.value.derivationPath);
        if (!pathData) {
            let title = this.translate.instant('Error');
            let subtitle = this.translate.instant('Invalid derivation path');
            this.popupProvider.ionicAlert(title, subtitle);
            return;
        }
        opts.account = pathData.account;
        opts.networkName = pathData.networkName;
        opts.derivationStrategy = pathData.derivationStrategy;
        opts.coin = this.importForm.value.coin;
        let words = this.importForm.value.words || null;
        if (!words) {
            let title = this.translate.instant('Error');
            let subtitle = this.translate.instant('Please enter the recovery phrase');
            this.popupProvider.ionicAlert(title, subtitle);
            return;
        }
        else if (words.indexOf('xprv') == 0 || words.indexOf('tprv') == 0) {
            return this.importExtendedPrivateKey(words, opts);
        }
        else {
            let wordList = words.split(/[\u3000\s]+/);
            if (wordList.length % 3 != 0) {
                let title = this.translate.instant('Error');
                let subtitle = this.translate.instant('Wrong number of recovery words:');
                this.popupProvider.ionicAlert(title, subtitle + ' ' + wordList.length);
                return;
            }
        }
        opts.passphrase = this.importForm.value.passphrase || null;
        this.importMnemonic(words, opts);
    }
    toggleShowAdvOpts() {
        this.showAdvOpts = !this.showAdvOpts;
    }
    fileChangeEvent($event) {
        this.file = $event.target
            ? $event.target.files[0]
            : $event.srcElement.files[0];
        this.formFile = $event.target.value;
        // Most browsers return `C:\fakepath\FILENAME`
        this.prettyFileName = this.formFile.split('\\').pop();
        this.getFile();
    }
    getFile() {
        // If we use onloadend, we need to check the readyState.
        this.reader.onloadend = () => {
            if (this.reader.readyState === 2) {
                // DONE === 2
                let opts = {};
                opts.bwsurl = this.importForm.value.bwsURL;
                opts.coin = this.importForm.value.coin;
                this.importBlob(this.reader.result, opts);
            }
        };
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
ImportWalletPage = __decorate([
    Component({
        selector: 'page-import-wallet',
        templateUrl: 'import-wallet.html'
    }),
    __metadata("design:paramtypes", [App,
        NavController,
        NavParams,
        FormBuilder,
        BwcProvider,
        DerivationPathHelperProvider,
        WalletProvider,
        ConfigProvider,
        PopupProvider,
        PlatformProvider,
        Logger,
        OnGoingProcessProvider,
        ProfileProvider,
        TranslateService,
        Events,
        PushNotificationsProvider])
], ImportWalletPage);
export { ImportWalletPage };
//# sourceMappingURL=import-wallet.js.map