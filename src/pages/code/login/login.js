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
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../providers/logger/logger';
// Providers
import { ConfigProvider } from '../../providers/config/config';
import { DerivationPathHelperProvider } from '../../providers/derivation-path-helper/derivation-path-helper';
import { OnGoingProcessProvider } from '../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../providers/popup/popup';
import { ProfileProvider } from '../../providers/profile/profile';
import { LoginProvider } from '../../providers/login/service';
import { PushNotificationsProvider } from '../../providers/push-notifications/push-notifications';
import { WalletProvider } from '../../providers/wallet/wallet';
import * as _ from 'lodash';
import { RegisterPage } from './register/register';
import { ForgotpassPage } from './forgotpass/forgotpass';
let LoginPage = class LoginPage {
    constructor(http, navCtrl, navParams, fb, profileProvider, loginProvider, configProvider, derivationPathHelperProvider, popupProvider, onGoingProcessProvider, logger, walletProvider, translate, events, pushNotificationsProvider) {
        this.http = http;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.fb = fb;
        this.profileProvider = profileProvider;
        this.loginProvider = loginProvider;
        this.configProvider = configProvider;
        this.derivationPathHelperProvider = derivationPathHelperProvider;
        this.popupProvider = popupProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.logger = logger;
        this.walletProvider = walletProvider;
        this.translate = translate;
        this.events = events;
        this.pushNotificationsProvider = pushNotificationsProvider;
        this.phone = true;
        this.otp = false;
        this.Register = "Proceed";
        this.username = localStorage.getItem('username');
        this.password = localStorage.getItem('password');
        this.okText = this.translate.instant('Ok');
        this.cancelText = this.translate.instant('Cancel');
        this.isShared = this.navParams.get('isShared');
        this.defaults = this.configProvider.getDefaults();
        this.tc = this.isShared ? this.defaults.wallet.totalCopayers : 1;
        this.copayers = _.range(2, this.defaults.limits.totalCopayers + 1);
        this.derivationPathByDefault = this.derivationPathHelperProvider.default;
        this.derivationPathForTestnet = this.derivationPathHelperProvider.defaultTestnet;
        this.showAdvOpts = false;
        this.createForm = this.fb.group({
            phone_number: [this.username],
            password: [this.password],
            otp: [null]
        });
    }
    ngOnInit() {
    }
    // pn: 14438134964 pass: 123456
    get uname() {
        return this.createForm.value['phone_number'];
    }
    get pass() {
        return this.createForm.value['password'];
    }
    get ootp() {
        return this.createForm.value['password'];
    }
    loginToWallet() {
        if (this.Register === "Register") {
            const data = JSON.stringify({ "code": this.ootp, "password": this.pass });
            this.loginProvider.reset(this.data)
                .subscribe((res) => {
                const response = res;
                console.log(response);
            }, (err) => {
                const error = err;
                console.log(error);
            });
        }
        this.data = { "phone_number": this.uname, "password": this.pass };
        console.log(this.data);
        this.loginProvider.login(this.uname, this.pass, '/app-auth')
            .subscribe((res) => {
            const response = res;
            this.cookie = res.body;
            if (response.status === 200) {
                const data = JSON.stringify({ "phone_number": this.uname });
                this.loginProvider.getTransactions(this.cookie, data)
                    .subscribe((res) => {
                    const response = res;
                    console.log(response);
                }, (err) => {
                    const error = err;
                    console.log(error);
                });
                localStorage.setItem('cookie', this.cookie);
                localStorage.setItem('username', this.uname);
                localStorage.setItem('password', this.pass);
                console.log("user logged in");
                // this.navCtrl.push(TransactionsPage);
            }
            else if (response.status == 400) {
                this.phone = false;
                this.otp = true;
                this.Register = "Register";
                console.log("create  account");
            }
            else if (response.status == 401) {
                console.log("incorrect password");
            }
            else {
                console.log("unexpected error");
            }
            console.log(response);
        }, (err) => {
            const error = err;
            if (error.status == 404) {
                const data = JSON.stringify({ "phone_number": this.uname });
                this.loginProvider.register(this.data)
                    .subscribe((res) => {
                    const response = res;
                    console.log(response);
                }, (err) => {
                    const error = err;
                    this.phone = false;
                    this.otp = true;
                    this.Register = "Register";
                    console.log(error);
                });
                console.log("create  account");
            }
            else if (error.status == 401) {
                console.log(error);
            }
            else {
                console.log(error);
            }
        });
    }
    goToregister() {
        this.navCtrl.push(RegisterPage);
        console.log("going to register");
    }
    goTofp() {
        this.navCtrl.push(ForgotpassPage);
    }
};
LoginPage = __decorate([
    Component({
        selector: 'page-login',
        templateUrl: 'login.html'
    }),
    __metadata("design:paramtypes", [HttpClient,
        NavController,
        NavParams,
        FormBuilder,
        ProfileProvider,
        LoginProvider,
        ConfigProvider,
        DerivationPathHelperProvider,
        PopupProvider,
        OnGoingProcessProvider,
        Logger,
        WalletProvider,
        TranslateService,
        Events,
        PushNotificationsProvider])
], LoginPage);
export { LoginPage };
//# sourceMappingURL=login.js.map