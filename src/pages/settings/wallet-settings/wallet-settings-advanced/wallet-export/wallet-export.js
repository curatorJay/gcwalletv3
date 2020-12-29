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
import { App, NavParams, ToastController } from 'ionic-angular';
import { Logger } from '../../../../../providers/logger/logger';
// native
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
// providers
import { AppProvider } from '../../../../../providers/app/app';
import { BackupProvider } from '../../../../../providers/backup/backup';
import { PersistenceProvider } from '../../../../../providers/persistence/persistence';
import { PlatformProvider } from '../../../../../providers/platform/platform';
import { PopupProvider } from '../../../../../providers/popup/popup';
import { ProfileProvider } from '../../../../../providers/profile/profile';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { TabsPage } from '../../../../tabs/tabs';
let WalletExportPage = class WalletExportPage {
    constructor(app, profileProvider, walletProvider, navParams, formBuilder, popupProvider, logger, persistenceProvider, backupProvider, platformProvider, socialSharing, appProvider, clipboard, toastCtrl, translate) {
        this.app = app;
        this.profileProvider = profileProvider;
        this.walletProvider = walletProvider;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.popupProvider = popupProvider;
        this.logger = logger;
        this.persistenceProvider = persistenceProvider;
        this.backupProvider = backupProvider;
        this.platformProvider = platformProvider;
        this.socialSharing = socialSharing;
        this.appProvider = appProvider;
        this.clipboard = clipboard;
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.segments = 'file/text';
        this.password = '';
        this.result = '';
        this.showAdv = false;
        this.showAdvanced = false;
        this.exportWalletForm = this.formBuilder.group({
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            noSignEnabled: [false]
        }, { validator: this.matchingPasswords('password', 'confirmPassword') });
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad WalletExportPage');
    }
    ionViewWillEnter() {
        this.wallet = this.profileProvider.getWallet(this.navParams.data.walletId);
        this.isEncrypted = this.wallet.isPrivKeyEncrypted();
        this.canSign = this.wallet.canSign();
        this.isCordova = this.platformProvider.isCordova;
        this.isSafari = this.platformProvider.isSafari;
        this.isIOS = this.platformProvider.isIOS;
    }
    matchingPasswords(passwordKey, confirmPasswordKey) {
        return (group) => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];
            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
            return undefined;
        };
    }
    showAdvChange() {
        this.showAdv = !this.showAdv;
    }
    getPassword() {
        return new Promise((resolve, reject) => {
            if (this.password)
                return resolve(this.password);
            this.walletProvider
                .prepare(this.wallet)
                .then(password => {
                this.password = password;
                return resolve(password);
            })
                .catch(err => {
                return reject(err);
            });
        });
    }
    generateQrCode() {
        if (this.exportWalletInfo || !this.isEncrypted) {
            this.segments = 'qr-code';
        }
        this.getPassword()
            .then((password) => {
            this.walletProvider
                .getEncodedWalletInfo(this.wallet, password)
                .then(code => {
                if (!code)
                    this.supported = false;
                else {
                    this.supported = true;
                    this.exportWalletInfo = code;
                }
                this.segments = 'qr-code';
            })
                .catch((err) => {
                this.popupProvider.ionicAlert(this.translate.instant('Error'), err);
            });
        })
            .catch((err) => {
            this.popupProvider.ionicAlert(this.translate.instant('Error'), err);
        });
    }
    /*
      EXPORT WITHOUT PRIVATE KEY - PENDING
    */
    noSignEnabledChange() {
        if (!this.supported)
            return;
        this.walletProvider
            .getEncodedWalletInfo(this.wallet)
            .then((code) => {
            this.supported = true;
            this.exportWalletInfo = code;
        })
            .catch(err => {
            this.logger.error(err);
            this.supported = false;
            this.exportWalletInfo = null;
        });
    }
    downloadWalletBackup() {
        this.getPassword()
            .then((password) => {
            this.getAddressBook()
                .then(localAddressBook => {
                let opts = {
                    noSign: this.exportWalletForm.value.noSignEnabled,
                    addressBook: localAddressBook,
                    password
                };
                this.backupProvider
                    .walletDownload(this.exportWalletForm.value.password, opts, this.navParams.data.walletId)
                    .then(() => {
                    this.app.getRootNavs()[0].setRoot(TabsPage);
                })
                    .catch(() => {
                    this.popupProvider.ionicAlert(this.translate.instant('Error'), this.translate.instant('Failed to export'));
                });
            })
                .catch(() => {
                this.popupProvider.ionicAlert(this.translate.instant('Error'), this.translate.instant('Failed to export'));
            });
        })
            .catch((err) => {
            this.popupProvider.ionicAlert(this.translate.instant('Error'), err);
        });
    }
    getAddressBook() {
        return new Promise((resolve, reject) => {
            this.persistenceProvider
                .getAddressBook(this.wallet.credentials.network)
                .then(addressBook => {
                let localAddressBook = [];
                try {
                    localAddressBook = JSON.parse(addressBook);
                }
                catch (ex) {
                    this.logger.warn('Wallet Export: JSON Parse addressBook is not necessary', ex);
                }
                return resolve(localAddressBook);
            })
                .catch(err => {
                return reject(err);
            });
        });
    }
    getBackup() {
        return new Promise(resolve => {
            this.getPassword()
                .then((password) => {
                this.getAddressBook()
                    .then(localAddressBook => {
                    let opts = {
                        noSign: this.exportWalletForm.value.noSignEnabled,
                        addressBook: localAddressBook,
                        password
                    };
                    var ew = this.backupProvider.walletExport(this.exportWalletForm.value.password, opts, this.navParams.data.walletId);
                    if (!ew) {
                        this.popupProvider.ionicAlert(this.translate.instant('Error'), this.translate.instant('Failed to export'));
                    }
                    return resolve(ew);
                })
                    .catch(() => {
                    this.popupProvider.ionicAlert(this.translate.instant('Error'), this.translate.instant('Failed to export'));
                    return resolve();
                });
            })
                .catch((err) => {
                this.popupProvider.ionicAlert(this.translate.instant('Error'), err);
                return resolve();
            });
        });
    }
    viewWalletBackup() {
        this.getBackup().then(backup => {
            var ew = backup;
            if (!ew)
                return;
            this.backupWalletPlainText = ew;
        });
    }
    copyWalletBackup() {
        this.getBackup().then(backup => {
            var ew = backup;
            if (!ew)
                return;
            this.clipboard.copy(ew);
            let copyMessage = this.translate.instant('Copied to clipboard');
            let showSuccess = this.toastCtrl.create({
                message: copyMessage,
                duration: 1000
            });
            showSuccess.present();
        });
    }
    sendWalletBackup() {
        let preparingMessage = this.translate.instant('Preparing backup...');
        let showSuccess = this.toastCtrl.create({
            message: preparingMessage,
            duration: 1000
        });
        showSuccess.present();
        let name = this.wallet.credentials.walletName || this.wallet.credentials.walletId;
        if (this.wallet.alias) {
            name = this.wallet.alias + ' [' + name + ']';
        }
        this.getBackup().then(backup => {
            let ew = backup;
            if (!ew)
                return;
            if (this.exportWalletForm.value.noSignEnabled)
                name = name + '(No Private Key)';
            let subject = this.appProvider.info.nameCase + ' Wallet Backup: ' + name;
            let body = 'Here is the encrypted backup of the wallet ' +
                name +
                ': \n\n' +
                ew +
                '\n\n To import this backup, copy all text between {...}, including the symbols {}';
            this.socialSharing.shareViaEmail(body, subject, null, // TO: must be null or an array
            null, // CC: must be null or an array
            null, // BCC: must be null or an array
            null // FILES: can be null, a string, or an array
            );
        });
    }
};
WalletExportPage = __decorate([
    Component({
        selector: 'page-wallet-export',
        templateUrl: 'wallet-export.html'
    }),
    __metadata("design:paramtypes", [App,
        ProfileProvider,
        WalletProvider,
        NavParams,
        FormBuilder,
        PopupProvider,
        Logger,
        PersistenceProvider,
        BackupProvider,
        PlatformProvider,
        SocialSharing,
        AppProvider,
        Clipboard,
        ToastController,
        TranslateService])
], WalletExportPage);
export { WalletExportPage };
//# sourceMappingURL=wallet-export.js.map