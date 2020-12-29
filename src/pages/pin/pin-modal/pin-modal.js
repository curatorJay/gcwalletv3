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
import { StatusBar } from '@ionic-native/status-bar';
import { Vibration } from '@ionic-native/vibration';
import { NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { Animate } from '../../../directives/animate/animate';
import { ConfigProvider } from '../../../providers/config/config';
import { Logger } from '../../../providers/logger/logger';
import { PersistenceProvider } from '../../../providers/persistence/persistence';
let PinModalPage = class PinModalPage {
    constructor(configProvider, logger, platform, navCtrl, navParams, persistenceProvider, statusBar, vibration, viewCtrl) {
        this.configProvider = configProvider;
        this.logger = logger;
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.persistenceProvider = persistenceProvider;
        this.statusBar = statusBar;
        this.vibration = vibration;
        this.viewCtrl = viewCtrl;
        this.ATTEMPT_LIMIT = 3;
        this.ATTEMPT_LOCK_OUT_TIME = 5 * 60;
        this.currentAttempts = 0;
        this.currentPin = '';
        this.firstPinEntered = '';
        this.confirmingPin = false;
        this.action = '';
        this.disableButtons = false;
        this.expires = '';
        this.incorrect = false;
        this.unregister = this.platform.registerBackButtonAction(() => { });
        this.action = this.navParams.get('action');
        if (this.action === 'checkPin' || this.action === 'lockSetUp') {
            this.persistenceProvider.getLockStatus().then((isLocked) => {
                if (!isLocked)
                    return;
                if (this.action === 'checkPin') {
                    this.showLockTimer();
                    this.setLockRelease();
                }
            });
        }
    }
    ionViewWillEnter() {
        if (this.platform.is('ios')) {
            this.statusBar.styleDefault();
        }
    }
    ionViewWillLeave() {
        if (this.platform.is('ios')) {
            this.statusBar.styleLightContent();
        }
    }
    close(cancelClicked) {
        if (this.countDown) {
            clearInterval(this.countDown);
        }
        this.unregister();
        if (this.action === 'lockSetUp')
            this.viewCtrl.dismiss(cancelClicked);
        else
            this.navCtrl.pop({ animate: true });
    }
    newEntry(value) {
        if (this.disableButtons)
            return;
        if (value === 'delete') {
            return this.delete();
        }
        this.incorrect = false;
        this.currentPin = this.currentPin + value;
        if (!this.isComplete())
            return;
        if (this.action === 'checkPin' || this.action === 'lockSetUp') {
            setTimeout(() => {
                this.checkIfCorrect();
            }, 100);
        }
        if (this.action === 'pinSetUp') {
            setTimeout(() => {
                if (!this.confirmingPin) {
                    this.confirmingPin = true;
                    this.firstPinEntered = this.currentPin;
                    this.currentPin = '';
                }
                else if (this.firstPinEntered === this.currentPin)
                    this.save();
                else {
                    this.firstPinEntered = this.currentPin = '';
                    this.incorrect = true;
                    this.confirmingPin = false;
                    this.shakeCode();
                }
            }, 100);
        }
    }
    checkAttempts() {
        this.currentAttempts += 1;
        this.logger.info('Attempts to unlock:', this.currentAttempts);
        this.incorrect = true;
        if (this.currentAttempts == this.ATTEMPT_LIMIT &&
            this.action !== 'lockSetUp') {
            this.currentAttempts = 0;
            this.persistenceProvider.setLockStatus('locked');
            this.showLockTimer();
            this.setLockRelease();
        }
    }
    showLockTimer() {
        this.disableButtons = true;
        let bannedUntil = Math.floor(Date.now() / 1000) + this.ATTEMPT_LOCK_OUT_TIME;
        this.countDown = setInterval(() => {
            let now = Math.floor(Date.now() / 1000);
            let totalSecs = bannedUntil - now;
            let m = Math.floor(totalSecs / 60);
            let s = totalSecs % 60;
            this.expires = ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
        }, 1000);
    }
    setLockRelease() {
        setTimeout(() => {
            clearInterval(this.countDown);
            this.unlock();
        }, this.ATTEMPT_LOCK_OUT_TIME * 1000);
    }
    unlock() {
        this.expires = this.disableButtons = null;
        this.currentPin = this.firstPinEntered = '';
        this.persistenceProvider.removeLockStatus();
    }
    delete() {
        if (this.disableButtons)
            return;
        this.currentPin = this.currentPin.substring(0, this.currentPin.length - 1);
    }
    isComplete() {
        if (this.currentPin.length < 4)
            return false;
        else
            return true;
    }
    save() {
        let lock = { method: 'pin', value: this.currentPin, bannedUntil: null };
        this.configProvider.set({ lock });
        this.close();
    }
    checkIfCorrect() {
        let config = this.configProvider.get();
        let pinValue = config.lock && config.lock.value;
        if (pinValue == this.currentPin) {
            if (this.action === 'checkPin' || this.action === 'lockSetUp') {
                this.close();
            }
        }
        else {
            this.currentPin = '';
            this.checkAttempts();
            this.shakeCode();
        }
    }
    shakeCode() {
        this.pinCode.animate('shake');
        this.vibration.vibrate(100);
    }
};
__decorate([
    ViewChild(Animate),
    __metadata("design:type", Animate)
], PinModalPage.prototype, "pinCode", void 0);
PinModalPage = __decorate([
    Component({
        selector: 'page-pin',
        templateUrl: 'pin-modal.html'
    }),
    __metadata("design:paramtypes", [ConfigProvider,
        Logger,
        Platform,
        NavController,
        NavParams,
        PersistenceProvider,
        StatusBar,
        Vibration,
        ViewController])
], PinModalPage);
export { PinModalPage };
//# sourceMappingURL=pin-modal.js.map