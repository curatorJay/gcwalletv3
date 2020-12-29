import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import {
  WalletOptions,
  WalletProvider
} from '../../providers/wallet/wallet';

import * as _ from 'lodash';
import { RegisterPage } from './register/register';
import { ForgotpassPage } from './forgotpass/forgotpass';
import { TransactionsPage } from '../transactions/transactions';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  /* For compressed keys, m*73 + n*34 <= 496 */

  private createForm: FormGroup;
  private defaults;
  private tc: number;
  private derivationPathByDefault: string;
  private derivationPathForTestnet: string;
  private phone = true;
  private otp = false;
  private Register = "Proceed"
  public copayers: number[];
  public signatures: number[];
  public showAdvOpts: boolean;
  public seedOptions;
  public isShared: boolean;
  public title: string;
  public okText: string;
  public cancelText: string;
  public data;
  public username = localStorage.getItem('username');
  public password = localStorage.getItem('password');
  public token;
  public passkey;
  public message = "";

  constructor(
    public http: HttpClient,
    private navCtrl: NavController,
    private navParams: NavParams,
    private fb: FormBuilder,
    private profileProvider: ProfileProvider,
    private loginProvider: LoginProvider,
    private configProvider: ConfigProvider,
    private derivationPathHelperProvider: DerivationPathHelperProvider,
    private popupProvider: PopupProvider,
    private onGoingProcessProvider: OnGoingProcessProvider,
    private logger: Logger,
    private walletProvider: WalletProvider,
    private translate: TranslateService,
    private events: Events,
    private pushNotificationsProvider: PushNotificationsProvider
  ) {
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
  get uname(): string {
    return this.createForm.value['phone_number'];
  }

  get pass(): string {
    return this.createForm.value['password'];
  }

  get ootp(): string {
    return this.createForm.value['password'];
  }

  public loginToWallet(){
    if(this.Register === "Register"){
      const data = JSON.stringify({"code":this.ootp, "password":this.pass});
      this.loginProvider.reset(this.data)
      .subscribe((res) => {
        const response = res;
        this.navCtrl.push(TransactionsPage);
        console.log(response);
      }, (err) => {
        this.message = "there was an issue"
        const error = err;
        console.log(error);
      });
    } 



    this.data = {"phone_number":this.uname, "password":this.pass}
    console.log(this.data);
    this.loginProvider.login(this.uname, this.pass, '/app-auth')
      .subscribe((res:HttpResponse<any>) => {
        const response = res;
        this.token = res.body;
        if(response.status === 200 || response.status === 202){
          localStorage.setItem('token', this.token);
          localStorage.setItem('username', this.uname);
          localStorage.setItem('password', this.pass);
          console.log("user logged in")
          console.log(res.headers);

          this.navCtrl.push(TransactionsPage);
        }else if(response.status == 201){
            const data = JSON.stringify({"phone_number":this.uname});
            this.loginProvider.register(this.data)
            .subscribe((res) => {
              const response = res;
              this.phone = false;
              this.otp = true;
              this.Register = "Register";
              console.log(response); 
            }, (err) => {
              const error = err;
              console.log(error);
            });
            console.log("create  account")
        }else if(response.status == 401){
            console.log("incorrect password")
        }else{
            console.log("unexpected error " + response)
        }
        // console.log(response); 
      }, (err) => {
        const error = err;
        if(error.status == 404 || error.status == 201){
          console.log("create  account error")
        }else if(error.status == 401){
            console.log(error)
        }else{
            console.log(error)
        }
      });
  }

  public goToregister(){
     this.navCtrl.push(RegisterPage);
     console.log("going to register")
  }

  public goTofp(){
    this.navCtrl.push(ForgotpassPage);
  }

 
}
