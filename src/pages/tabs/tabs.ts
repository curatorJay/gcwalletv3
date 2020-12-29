import { Component, ViewChild } from '@angular/core';
import { HomePage } from '../home/home';
import { ReceivePage } from '../receive/receive';
import { ScanPage } from '../scan/scan';
import { SendPage } from '../send/send';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from '../login/login';
// import { TransactionsPage } from '../transactions/transactions';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('tabs')
  tabs;

  homeRoot = HomePage;
  receiveRoot = ReceivePage;
  scanRoot = ScanPage;
  sendRoot = SendPage;
  settingsRoot = SettingsPage;
  LoginRoot = LoginPage;
  // TransactionRoot = TransactionsPage;

  constructor() {}
}
