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
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { Logger } from '../../providers/logger/logger';
// import { PopupProvider } from '../../providers/popup/popup';
/**
 * Generated class for the AtmLocationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let AtmLocationsPage = class AtmLocationsPage {
    constructor(navCtrl, navParams, logger, translate, externalLinkProvider, 
    // private popupProvider: PopupProvider,
    iab // private geo: Geolocation,
    ) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.logger = logger;
        this.translate = translate;
        this.externalLinkProvider = externalLinkProvider;
        this.iab = iab;
        this.googleMapAPIKey = 'AIzaSyB43uqfV0AdFqBJ-MasTqVwtuNLFasOxPg';
        this.gcATMName = 'GetCoins Bitcoin ATM';
        this.travelMode = 'driving';
        // this.id = navParams.get('locationId');
        // this.serverJson = navParams.get('serverJson');
        // this.localJson = navParams.get('localJson');
        this.data = navParams.get('dataSet');
        this.myLocation = navParams.get('geolocation');
        this.encodedAddress = encodeURIComponent(this.gcATMName +
            ' ' +
            this.data.street +
            ' ' +
            this.data.city +
            ', ' +
            this.data.state +
            ' ' +
            this.data.zipcode);
        this.encodedMyLocation = encodeURIComponent(this.myLocation['lat'] + ',' + this.myLocation['lng']);
        this.encodedDirection = encodeURIComponent(this.gcATMName +
            ' ' +
            this.data.street +
            ' ' +
            this.data.city +
            ', ' +
            this.data.state +
            ' ' +
            this.data.zipcode);
        this.googleUrl =
            'https://www.google.com/maps/embed/v1/place?key=' +
                this.googleMapAPIKey +
                '&q=' +
                this.encodedAddress +
                '&zoom=14';
        this.googleDirUrl =
            'https://www.google.com/maps/dir/?api=1&origin=' +
                this.encodedMyLocation +
                '&destination=' +
                this.encodedDirection +
                '&travelmode=' +
                this.travelMode;
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad AtmLocationsPage');
    }
    /**
     * Open direction page directly without popup msg by opening a new browser, using INAppBrowser plugin
     * (The other openDirectionLink method is used as of Jan 25, 2019)
     */
    getDirectionPage() {
        const browser = this.iab.create(this.googleDirUrl, '_blank');
        browser.show();
    }
    /**
     * Open direction page with popup menu
     * Another way to take user to the DIrection external page
     */
    openDirectionLink() {
        let url = this.googleDirUrl;
        let optIn = true;
        let title = null;
        let message = this.translate.instant('Open Google Map');
        let okText = this.translate.instant('Direction');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    /**
     * Open customer support call popup msg
     */
    callCustomerSupport() {
        let url = 'tel:+1-860-800-2646';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('You can call us now at 860-800-2646');
        let okText = this.translate.instant('Call');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
};
AtmLocationsPage = __decorate([
    Component({
        selector: 'page-atm-locations',
        templateUrl: 'atm-locations.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Logger,
        TranslateService,
        ExternalLinkProvider,
        InAppBrowser // private geo: Geolocation,
    ])
], AtmLocationsPage);
export { AtmLocationsPage };
//# sourceMappingURL=atm-locations.js.map