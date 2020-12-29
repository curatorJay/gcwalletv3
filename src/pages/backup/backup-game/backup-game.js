var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Navbar, NavController, NavParams, Slides } from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from '../../../providers/logger/logger';
// pages
import { DisclaimerPage } from '../../onboarding/disclaimer/disclaimer';
// providers
import { BwcProvider } from '../../../providers/bwc/bwc';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../../providers/popup/popup';
import { ProfileProvider } from '../../../providers/profile/profile';
import { WalletProvider } from '../../../providers/wallet/wallet';
let BackupGamePage = class BackupGamePage {
    constructor(navCtrl, navParams, logger, profileProvider, walletProvider, bwcProvider, onGoingProcessProvider, popupProvider, translate) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.logger = logger;
        this.profileProvider = profileProvider;
        this.walletProvider = walletProvider;
        this.bwcProvider = bwcProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.popupProvider = popupProvider;
        this.translate = translate;
        this.walletId = this.navParams.get('walletId');
        this.fromOnboarding = this.navParams.get('fromOnboarding');
        // **GCEdit: Added conditions to it so it will help to see when something went wrong.
        this.wallet = this.profileProvider.getWallet(this.walletId) ? this.profileProvider.getWallet(this.walletId) : { Error: 'someting went wrong. there is not wallet data.' };
        this.credentialsEncrypted = this.wallet.isPrivKeyEncrypted();
    }
    ionViewDidEnter() {
        this.deleted = this.isDeletedSeed();
        if (this.deleted) {
            this.logger.debug('no mnemonics');
            return;
        }
        this.walletProvider
            .getKeys(this.wallet)
            .then(keys => {
            if (_.isEmpty(keys)) {
                this.logger.error('Empty keys');
            }
            this.credentialsEncrypted = false;
            this.keys = keys;
            this.setFlow();
        })
            .catch(err => {
            this.logger.error('Could not get keys: ', err);
            this.navCtrl.pop();
        });
    }
    ngOnInit() {
        this.currentIndex = 0;
        this.navBar.backButtonClick = () => {
            if (this.slides)
                this.slidePrev();
            else
                this.navCtrl.pop();
        };
    }
    ionViewDidLoad() {
        if (this.slides)
            this.slides.lockSwipes(true);
    }
    shuffledWords(words) {
        var sort = _.sortBy(words);
        return _.map(sort, w => {
            return {
                word: w,
                selected: false
            };
        });
    }
    addButton(index, item) {
        var newWord = {
            word: item.word,
            prevIndex: index
        };
        this.customWords.push(newWord);
        this.shuffledMnemonicWords[index].selected = true;
        this.shouldContinue();
    }
    removeButton(index, item) {
        // if ($scope.loading) return;
        this.customWords.splice(index, 1);
        this.shuffledMnemonicWords[item.prevIndex].selected = false;
        this.shouldContinue();
    }
    shouldContinue() {
        this.selectComplete =
            this.customWords.length === this.shuffledMnemonicWords.length
                ? true
                : false;
    }
    isDeletedSeed() {
        if (!this.wallet.credentials.mnemonic &&
            !this.wallet.credentials.mnemonicEncrypted)
            return true;
        return false;
    }
    slidePrev() {
        this.slides.lockSwipes(false);
        if (this.currentIndex == 0)
            this.navCtrl.pop();
        else {
            this.slides.slidePrev();
            this.currentIndex = this.slides.getActiveIndex();
        }
        this.slides.lockSwipes(true);
    }
    slideNext(reset) {
        if (reset) {
            this.resetGame();
        }
        if (this.currentIndex == 1 && !this.mnemonicHasPassphrase)
            this.finalStep();
        else {
            this.slides.lockSwipes(false);
            this.slides.slideNext();
        }
        this.currentIndex = this.slides.getActiveIndex();
        this.slides.lockSwipes(true);
    }
    resetGame() {
        this.customWords = [];
        this.shuffledMnemonicWords.forEach(word => {
            word.selected = false;
        });
        this.selectComplete = false;
    }
    setFlow() {
        if (!this.keys)
            return;
        let words = this.keys.mnemonic;
        this.mnemonicWords = words.split(/[\u3000\s]+/);
        this.shuffledMnemonicWords = this.shuffledWords(this.mnemonicWords);
        this.mnemonicHasPassphrase = this.wallet.mnemonicHasPassphrase();
        this.useIdeograms = words.indexOf('\u3000') >= 0;
        this.password = '';
        this.customWords = [];
        this.selectComplete = false;
        this.error = false;
        words = _.repeat('x', 300);
        if (this.currentIndex == 2)
            this.slidePrev();
    }
    copyRecoveryPhrase() {
        if (this.wallet.network == 'livenet')
            return null;
        else if (this.keys.mnemonic)
            return this.keys.mnemonic;
        else
            return null;
    }
    confirm() {
        return new Promise((resolve, reject) => {
            this.error = false;
            let customWordList = _.map(this.customWords, 'word');
            if (!_.isEqual(this.mnemonicWords, customWordList)) {
                return reject('Mnemonic string mismatch');
            }
            if (this.mnemonicHasPassphrase) {
                let walletClient = this.bwcProvider.getClient();
                let separator = this.useIdeograms ? '\u3000' : ' ';
                let customSentence = customWordList.join(separator);
                let password = this.password || '';
                try {
                    walletClient.seedFromMnemonic(customSentence, {
                        network: this.wallet.credentials.network,
                        password,
                        account: this.wallet.credentials.account
                    });
                }
                catch (err) {
                    walletClient.credentials.xPrivKey = _.repeat('x', 64);
                    return reject(err);
                }
                if (walletClient.credentials.xPrivKey.substr(walletClient.credentials.xPrivKey) != this.keys.xPrivKey) {
                    delete walletClient.credentials;
                    return reject('Private key mismatch');
                }
            }
            this.profileProvider.setBackupFlag(this.wallet.credentials.walletId);
            return resolve();
        });
    }
    finalStep() {
        this.onGoingProcessProvider.set('validatingWords');
        this.confirm()
            .then(() => {
            this.onGoingProcessProvider.clear();
            const modal = this.popupProvider.createMiniModal('backup-ready');
            modal.present({ animate: false });
            modal.onDidDismiss(() => {
                if (this.fromOnboarding) {
                    this.navCtrl.push(DisclaimerPage);
                }
                else {
                    this.navCtrl.popToRoot({ animate: false });
                }
            });
        })
            .catch(err => {
            this.onGoingProcessProvider.clear();
            this.logger.warn('Failed to verify backup: ', err);
            this.error = true;
            let title = this.translate.instant('Uh oh...');
            let message = this.translate.instant("It's important that you write your backup phrase down correctly. If something happens to your wallet, you'll need this backup to recover your money. Please review your backup and try again.");
            this.popupProvider.ionicAlert(title, message).then(() => {
                this.setFlow();
            });
        });
    }
};
__decorate([
    ViewChild(Slides),
    __metadata("design:type", Slides)
], BackupGamePage.prototype, "slides", void 0);
__decorate([
    ViewChild(Navbar),
    __metadata("design:type", Navbar)
], BackupGamePage.prototype, "navBar", void 0);
BackupGamePage = __decorate([
    Component({
        selector: 'page-backup-game',
        templateUrl: 'backup-game.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Logger,
        ProfileProvider,
        WalletProvider,
        BwcProvider,
        OnGoingProcessProvider,
        PopupProvider,
        TranslateService])
], BackupGamePage);
export { BackupGamePage };
//# sourceMappingURL=backup-game.js.map