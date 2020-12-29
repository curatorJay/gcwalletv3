import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Events, NavController, AlertController, NavParams } from 'ionic-angular';
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

export class LoginPage {
  constructor(public navCtrl: NavController, public navParams: NavParams){
  	if(localStorage.getItem('issessionactive') != null ){
     this.navCtrl.push(RegisterPage);
     console.log(localStorage.getItem('issessionactive'));
    }else{
      console.log(localStorage.getItem('issessionactive'));
    }
  }
  // goTo Function 
  goTo(){
    this.navCtrl.setRoot(RegisterPage);
  }
}