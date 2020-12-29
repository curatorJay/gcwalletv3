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
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';
// pages
import { SessionLogPage } from './session-log/session-log';
import { TermsAndConditionsPage } from './terms-and-conditions/terms-and-conditions';
// providers
import { AppProvider } from '../../../providers/app/app';
import { ExternalLinkProvider } from '../../../providers/external-link/external-link';
import { ReplaceParametersProvider } from '../../../providers/replace-parameters/replace-parameters';
let AboutPage = class AboutPage {
    constructor(navCtrl, appProvider, logger, externalLinkProvider, replaceParametersProvider, translate) {
        this.navCtrl = navCtrl;
        this.appProvider = appProvider;
        this.logger = logger;
        this.externalLinkProvider = externalLinkProvider;
        this.replaceParametersProvider = replaceParametersProvider;
        this.translate = translate;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad AboutPage');
        this.commitHash = this.appProvider.info.commitHash;
        this.version = this.appProvider.info.version;
        this.commitHashOrigin = this.appProvider.info.commitHashOrigin;
        this.title = this.replaceParametersProvider.replace(this.translate.instant('About {{appName}}'), { appName: this.appProvider.info.nameCase });
    }
    openExternalLink() {
        let url = 'https://github.com/getcoinscom/' +
            this.appProvider.info.gitHubRepoName +
            '/tree/' +
            this.appProvider.info.commitHash +
            '';
        let optIn = true;
        let title = this.translate.instant('Open GitHub Project');
        let message = this.translate.instant('You can see the latest developments and contribute to this open source app by visiting our project on GitHub.');
        let okText = this.translate.instant('Open GitHub');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    openCopayLink() {
        let url = 'https://github.com/bitpay/' +
            this.appProvider.info.gitHubRepoNameOrigin +
            '/tree/' +
            this.appProvider.info.commitHashOrigin +
            '';
        let optIn = true;
        let title = this.translate.instant('Open GitHub Project');
        let message = this.translate.instant('You can see the latest developments and contribute to this open source app by visiting our project on GitHub.');
        let okText = this.translate.instant('Open GitHub');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    /*
      public openTermsOfUse() {
        let url = 'https://getcoins.com/about/';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('View Wallet Terms and Conditions');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(
          url,
          optIn,
          title,
          message,
          okText,
          cancelText
        );
      }
    */
    openTermsOfUse() {
        this.navCtrl.push(TermsAndConditionsPage);
    }
    openPrivacyPolicy() {
        let url = 'https://getcoins.com/about/';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('View Privacy Policy');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    openSessionLog() {
        this.navCtrl.push(SessionLogPage);
    }
};
AboutPage = __decorate([
    Component({
        selector: 'page-about',
        templateUrl: 'about.html'
    }),
    __metadata("design:paramtypes", [NavController,
        AppProvider,
        Logger,
        ExternalLinkProvider,
        ReplaceParametersProvider,
        TranslateService])
], AboutPage);
export { AboutPage };
//# sourceMappingURL=about.js.map