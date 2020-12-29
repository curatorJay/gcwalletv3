import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Component({
  selector: 'transactions-home',
  templateUrl: 'transactions.html'
})
export class TransactionsPage implements OnInit {
 
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
  public username;
  public password;
  private cookie;
  private passkey;

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

  }

  ngOnInit() {
    for (const [k, v] of this.loginProvider.cookie.headers.entries()) {
      console.log(k, v)
      if(k == "authorization"){
        this.passkey = v;
      }
    }
    this.cookie = this.passkey[0];
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    console.log(this.cookie.split(" ")[1]);
    const cookieval = this.loginProvider.cookieval;
    this.loginProvider.getTransactions(token, this.cookie.split(" ")[1], username)
      .subscribe((res) => {
        const response = res;
        console.log(response);
      }, (err) => {
        const error = err;
        console.log(error);
      });
  }

  public doRefresh(refresher) {
    refresher.pullMin = 90;
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
 
}
