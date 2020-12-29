var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Events, ModalController, NavController, Platform, AlertController } from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as localJsonFile from '../../assets/locations.json';
// Pages
import { AddPage } from '../add/add';
import { CopayersPage } from '../add/copayers/copayers';
import { AmazonPage } from '../integrations/amazon/amazon';
import { BitPayCardPage } from '../integrations/bitpay-card/bitpay-card';
import { BitPayCardIntroPage } from '../integrations/bitpay-card/bitpay-card-intro/bitpay-card-intro';
import { CoinbasePage } from '../integrations/coinbase/coinbase';
import { GlideraPage } from '../integrations/glidera/glidera';
import { MercadoLibrePage } from '../integrations/mercado-libre/mercado-libre';
import { ShapeshiftPage } from '../integrations/shapeshift/shapeshift';
import { TxDetailsPage } from '../tx-details/tx-details';
import { TxpDetailsPage } from '../txp-details/txp-details';
import { WalletDetailsPage } from '../wallet-details/wallet-details';
import { ActivityPage } from './activity/activity';
import { ProposalsPage } from './proposals/proposals';
import { AtmLocationsPage } from '../atm-locations/atm-locations';
// import { SupportCardPage } from '../includes/support-card/support-card';
// Providers
import { AddressBookProvider } from '../../providers/address-book/address-book';
import { AppProvider } from '../../providers/app/app';
import { BitPayCardProvider } from '../../providers/bitpay-card/bitpay-card';
import { BwcErrorProvider } from '../../providers/bwc-error/bwc-error';
import { ConfigProvider } from '../../providers/config/config';
import { EmailNotificationsProvider } from '../../providers/email-notifications/email-notifications';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { HomeIntegrationsProvider } from '../../providers/home-integrations/home-integrations';
import { Logger } from '../../providers/logger/logger';
import { OnGoingProcessProvider } from '../../providers/on-going-process/on-going-process';
import { PersistenceProvider } from '../../providers/persistence/persistence';
import { PlatformProvider } from '../../providers/platform/platform';
import { PopupProvider } from '../../providers/popup/popup';
import { ProfileProvider } from '../../providers/profile/profile';
import { ReleaseProvider } from '../../providers/release/release';
import { ReplaceParametersProvider } from '../../providers/replace-parameters/replace-parameters';
import { WalletProvider } from '../../providers/wallet/wallet';
import { AtmLocationProvider } from '../../providers/atm-location/atm-location';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
// import { Diagnostic } from '@ionic-native/diagnostic';
let HomePage = class HomePage {
    constructor(plt, navCtrl, profileProvider, releaseProvider, walletProvider, bwcErrorProvider, logger, events, configProvider, externalLinkProvider, onGoingProcessProvider, popupProvider, modalCtrl, addressBookProvider, appProvider, platformProvider, homeIntegrationsProvider, persistenceProvider, feedbackProvider, bitPayCardProvider, translate, emailProvider, replaceParametersProvider, atmLocationProvider, alertCtrl, geo, locationTracker, openNativeSettings // public geoProvider: GeolocationProvider // private diagnostic: Diagnostic
    ) {
        this.plt = plt;
        this.navCtrl = navCtrl;
        this.profileProvider = profileProvider;
        this.releaseProvider = releaseProvider;
        this.walletProvider = walletProvider;
        this.bwcErrorProvider = bwcErrorProvider;
        this.logger = logger;
        this.events = events;
        this.configProvider = configProvider;
        this.externalLinkProvider = externalLinkProvider;
        this.onGoingProcessProvider = onGoingProcessProvider;
        this.popupProvider = popupProvider;
        this.modalCtrl = modalCtrl;
        this.addressBookProvider = addressBookProvider;
        this.appProvider = appProvider;
        this.platformProvider = platformProvider;
        this.homeIntegrationsProvider = homeIntegrationsProvider;
        this.persistenceProvider = persistenceProvider;
        this.feedbackProvider = feedbackProvider;
        this.bitPayCardProvider = bitPayCardProvider;
        this.translate = translate;
        this.emailProvider = emailProvider;
        this.replaceParametersProvider = replaceParametersProvider;
        this.atmLocationProvider = atmLocationProvider;
        this.alertCtrl = alertCtrl;
        this.geo = geo;
        this.locationTracker = locationTracker;
        this.openNativeSettings = openNativeSettings;
        this.showBitPayCard = false;
        this.allLocDistanceArr = [];
        this.newResults = [];
        this.newResultsReady = false;
        this.toggledStart = false;
        this.warnToRefresh = false;
        this.orangeColor = '#f79420';
        this.grayColor = '#495057';
        this.redWarning = '#ef473a';
        this.iteratedNum = 0;
        this.setWallets = _.debounce(() => {
            this.wallets = this.profileProvider.getWallets();
            this.walletsBtc = _.filter(this.wallets, (x) => {
                return x.credentials.coin == 'btc';
            });
            this.walletsBch = _.filter(this.wallets, (x) => {
                return x.credentials.coin == 'bch';
            });
            this.updateAllWallets();
        }, 5000, {
            leading: true
        });
        this.updateTxps = _.debounce(() => {
            this.profileProvider
                .getTxps({ limit: 3 })
                .then(data => {
                this.zone.run(() => {
                    this.txps = data.txps;
                    this.txpsN = data.n;
                });
            })
                .catch(err => {
                this.logger.error(err);
            });
        }, 5000, {
            leading: true
        });
        this.getNotifications = _.debounce(() => {
            if (!this.recentTransactionsEnabled)
                return;
            this.profileProvider
                .getNotifications({ limit: 3 })
                .then(data => {
                this.zone.run(() => {
                    this.notifications = data.notifications;
                    this.notificationsN = data.total;
                });
            })
                .catch(err => {
                this.logger.error(err);
            });
        }, 5000, {
            leading: true
        });
        this.updatingWalletId = {};
        this.addressbook = {};
        this.cachedBalanceUpdateOn = '';
        this.isNW = this.platformProvider.isNW;
        this.showReorderBtc = false;
        this.showReorderBch = false;
        this.zone = new NgZone({ enableLongStackTrace: false });
        this.localJson = localJsonFile['locations'];
        this.loading = true;
        this.offline = false;
    }
    ionViewDidLoad() {
        this.loading = true;
        this.logger.info('ionViewDidLoad HomePage');
        // this.getAPIdata(); // ** No need to grab this; it will be done with loadGeolocation at the end */
        this.logger.info(this.loading, ' is loading');
        this.checkEmailLawCompliance();
        // Create, Join, Import and Delete -> Get Wallets -> Update Status for All Wallets
        this.events.subscribe('status:updated', () => {
            this.updateTxps();
            this.setWallets();
        });
        this.plt.resume.subscribe(() => {
            this.getNotifications();
            this.updateTxps();
            this.setWallets();
        });
        // **call loadGeolocation Promise and then call getClosestTenLocations func
        this.loadGeolocation().then(res => {
            if (res.error === null) {
                this.getClosestTenLocations(res, true);
            }
            else {
                this.getClosestTenLocations(res, false);
                this.loading = false;
            }
        }, err => {
            let errorObj = {
                lat: 0,
                lng: 0,
                error: err
            };
            this.getClosestTenLocations(errorObj, false);
            this.loading = false;
        });
    }
    ionViewWillEnter() {
        this.recentTransactionsEnabled = this.configProvider.get().recentTransactions.enabled;
        // Update list of wallets, status and TXPs
        this.setWallets();
        this.addressBookProvider
            .list()
            .then(ab => {
            this.addressbook = ab || {};
        })
            .catch(err => {
            this.logger.error(err);
        });
        // Update Tx Notifications
        this.getNotifications();
    }
    ionViewDidEnter() {
        if (this.isNW)
            this.checkUpdate();
        this.checkHomeTip();
        this.checkFeedbackInfo();
        // BWS Events: Update Status per Wallet
        // NewBlock, NewCopayer, NewAddress, NewTxProposal, TxProposalAcceptedBy, TxProposalRejectedBy, txProposalFinallyRejected,
        // txProposalFinallyAccepted, TxProposalRemoved, NewIncomingTx, NewOutgoingTx
        this.events.subscribe('bwsEvent', (walletId) => {
            this.getNotifications();
            this.updateWallet(walletId);
        });
        // Show integrations
        let integrations = _.filter(this.homeIntegrationsProvider.get(), {
            show: true
        });
        // Hide BitPay if linked
        setTimeout(() => {
            this.homeIntegrations = _.remove(_.clone(integrations), x => {
                if (x.name == 'debitcard' && x.linked)
                    return;
                else
                    return x;
            });
        }, 200);
        // Only BitPay Wallet
        this.bitPayCardProvider.get({}, (_, cards) => {
            this.zone.run(() => {
                this.showBitPayCard = this.appProvider.info._enabledExtensions.debitcard
                    ? true
                    : false;
                this.bitpayCardItems = cards;
            });
        });
    }
    ionViewWillLeave() {
        this.events.unsubscribe('bwsEvent');
    }
    /**
     * ==============================================================
     * =============== Closest Locatio Features (v2.0) ==============
     * ==============================================================
     */
    /**
     * Just to grab the location data from local json
     * (Not used as of Jan 25, 2019)
     */
    getLocalJsonInstead() {
        this.atmLocationProvider.getLocationsLocal().subscribe(data => {
            this.locations = data['locations'];
        });
    }
    /**
     * Grab the location data from api
     * (Not used as of Jan 25, 2019)
     */
    getAPIdata() {
        // this.logger.info('getAPIdata entered now');
        let observableAPI = this.atmLocationProvider.getLocations();
        // ** Get all ATM locations from API */
        observableAPI.subscribe(data => {
            this.locations = data['locations'];
        }, err => {
            this.getLocalJsonInstead();
            // this.logger.info('mmm.. not success from api but from local should work');
            this.logger.warn('HTTP Error', err);
        });
    }
    /**
     * Get user's Geolocation; Promise
     */
    loadGeolocation() {
        // this.logger.info('loadGeolocation func entered');
        this.loading = true;
        this.options = {
            enableHighAccuracy: true
        };
        // ** this method returns its own object, so you need to gran the coords.latitude and coord.longtitude,
        // and then, pass it to your variable to then return the valueto be able to work with the custome  */
        let getPosition = this.geo.getCurrentPosition(this.options).then((pos) => {
            this.myLocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                error: null
            };
            return this.myLocation;
        }, (err) => {
            this.myLocation = {
                lat: 0,
                lng: 0,
                error: err.message
            };
            return this.myLocation;
        });
        return getPosition;
    }
    // /**
    //  * Watch Geolocation if Location is enabled via diagnostic plugin
    //  * Not used as of Jan 25, 2019
    //  */
    // public watchGeolocation() {
    //   this.logger.info(this.myLocation, ' is this.myLocation');
    //   this.diagnostic
    //     .isLocationEnabled()
    //     .then(isAvailable => {
    //       this.logger.info('Is available? ' + isAvailable);
    //       alert('Is available? ' + isAvailable);
    //       this.watch = this.geo.watchPosition();
    //       this.watch.subscribe(
    //         data => {
    //           // data can be a set of coordinates, or an error (if an error occurred).
    //           // data.coords.latitude
    //           // data.coords.longitude
    //           // this.logger.info(data, ' is watched geo data');
    //           this.myLocation = {
    //             lat: data.coords.latitude,
    //             lng: data.coords.longitude,
    //             error: null
    //           };
    //           return this.myLocation;
    //         },
    //         err => {
    //           // this.logger.info(err, ' is error from watchGeolocation inside data');
    //           this.myLocation = {
    //             lat: this.myLocation.lat,
    //             lng: this.myLocation.lng,
    //             error: err.message
    //           };
    //           return this.myLocation;
    //         }
    //       );
    //     })
    //     .catch(err => {
    //       // this.logger.info(err);
    //       // alert(JSON.stringify(err)); //** this will alert the error msg like: GC Wallet\n plugin_not_found */
    //       // this.logger.info(err, ' is error from watchGeolocation inside catch');
    //       this.myLocation = {
    //         lat: this.myLocation.lat,
    //         lng: this.myLocation.lng,
    //         error: err
    //       };
    //       return this.myLocation;
    //     });
    // }
    /**
     * Open device specific setting (Settings page) to enable Geolocation
     * when users dont have it on by default
     * @param setting
     */
    openPhoneSettings(setting) {
        this.openMsgForPhoneSettings(setting);
    }
    /**
     * THe actual popup message function for openPhoneSettings
     * @param setting
     */
    openMsgForPhoneSettings(setting) {
        let message = this.translate.instant('Go open your phone settings?');
        let title = this.translate.instant('Open Settings');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go back');
        this.popupProvider
            .ionicConfirm(title, message, okText, cancelText)
            .then(ok => {
            if (ok) {
                this.openNativeSettings.open(setting).then(res => {
                    this.logger.info(res, ' the settings was indeed opened');
                    // ** Just warn the user to refresh the wallet to see the effect
                    this.warnToRefresh = true;
                });
            }
            else {
                // ** Just warn the user to refresh the wallet to see the effect
                this.warnToRefresh = false;
            }
        });
    }
    /**
     * Based on the geoObj parameter value, set the location data to newResults variable
     * (NOTE: This needs to work in conjunction with loadGeolocation func above with Promise->then)
     * @param geoObj: object
     * @param api: boolean
     */
    getClosestTenLocations(geoObj, api) {
        this.newResults = [];
        this.iteratedNum++;
        this.loading = true;
        /** If geoObj.error is null (meaning it was set to null upon loadGeolocation),
         * then run first to see api works. If it didnt, then grab data from local json file.
         */
        if (geoObj.error === null) {
            this.newResults = this.atmLocationProvider
                .getLocationsPromise(geoObj, api)
                .then(
            // ** if the response is okay, meaning the api worked,
            // then you grabbed the new results */
            res => {
                this.newResults = res;
                this.loading = false;
                this.newResultsReady = true;
            }, 
            // ** If the api didnt work, then next grab data
            // from the local data
            err => {
                this.newResults = this.atmLocationProvider
                    .getLocationsPromise(geoObj, false)
                    .then(res => {
                    this.newResults = res;
                    this.loading = false;
                    this.newResultsReady = true;
                }, err => {
                    this.logger.warn(err.message);
                });
                this.logger.info(err);
                this.loading = false;
            });
        }
        else {
            /** If geoObj.error had msg in it, then try grabbing the data from the local json
             * If this failed, then no data to show, so return the error message
             */
            this.newResults = this.atmLocationProvider
                .getLocationsPromise(geoObj, false)
                .then(res => {
                this.newResults = res;
                this.loading = false;
                this.newResultsReady = true;
            }, err => {
                this.logger.info(err);
                this.loading = false;
            });
            this.logger.warn('Your geolocation is turned off. To better assist you, please eneable the geolocation.');
        }
    }
    /**
     * Search the geolocation again and find the closest location
     * upon clicking on the Search Again button
     */
    searchAgain() {
        // ** Check if the platform is ready first
        this.plt.ready().then(() => {
            // ** The platform is ready here now and our plugins are available.
            // ** Here you can do any higher level native things you might need.
            this.newResultsReady = false;
            this.newResults = [];
            // let newLatLng = this.loadGeolocation().then( // ** took this out to avoid ts error for not using newLatLng variable
            this.loadGeolocation().then(res => {
                if (res.error === null) {
                    this.offline = false;
                    this.getClosestTenLocations(res, true);
                }
                else {
                    this.offline = true;
                    this.getClosestTenLocations(res, false);
                    this.loading = false;
                }
            }, err => {
                this.getClosestTenLocations(err, false);
                this.loading = false;
            });
        });
    }
    // // **GCEdit: We wont be traking methods, so just for record
    // /**
    //  * Initiate the tracking by opening the confirmation message
    //  */
    // public startTrack() {
    //   this.openStartTrackMsg();
    // }
    // /**
    //  * Using LocationTracker provider, call for startTracking method
    //  * from the provider and set the toggledStart to be true
    //  * (so that the button will set to Stop tracking)
    //  */
    // private openStartTrackMsg() {
    //   let message = this.translate.instant(
    //     'Would you like to start tracking your location?'
    //   );
    //   let title = this.translate.instant('Start Track');
    //   let okText = this.translate.instant('Start');
    //   let cancelText = this.translate.instant('Go back');
    //   this.popupProvider
    //     .ionicConfirm(title, message, okText, cancelText)
    //     .then(ok => {
    //       if (ok) {
    //         this.logger.info(ok, ' is the response from the open StartTrackmsg');
    //         // Stop tracking user's location
    //         this.locationTracker.startTracking(this.updateNewResults);
    //         this.toggledStart = true;
    //       } else {
    //         // Do nothing
    //         this.toggledStart = false;
    //       }
    //     });
    // }
    // /**
    //  * Stop the tracking by opening the confirmation message
    //  */
    // public stopTrack() {
    //   this.openStopTrackMsg();
    // }
    // /**
    //  * Using LocationTracker provider, call for stopTracking method
    //  * from the provider and set the toggledStart to be false
    //  * (so that the button will set to Stop tracking)
    //  */
    // private openStopTrackMsg() {
    //   let message = this.translate.instant(
    //     'Would you like to stop tracking your location?'
    //   );
    //   let title = this.translate.instant('Stop Track');
    //   let okText = this.translate.instant('Stop');
    //   let cancelText = this.translate.instant('Go back');
    //   this.popupProvider
    //     .ionicConfirm(title, message, okText, cancelText)
    //     .then(ok => {
    //       if (ok) {
    //         // Stop tracking user's location
    //         this.locationTracker.stopTracking();
    //         this.toggledStart = false;
    //       } else {
    //         // Just change the setting
    //         this.toggledStart = true;
    //       }
    //     });
    // }
    // /**
    //  * The callback function for the locationTracker provider's startTracking method
    //  * @param lat: number
    //  * @param lng: number
    //  * @return: NOTHING. Just to set myLocatino object.
    //  */
    // public updateNewResults(lat: number, lng: number): void {
    //   this.logger.info('updateNewReslts func run!');
    //   this.logger.info(this.locationTracker, ' is locationTracker provider');
    //   this.logger.info(
    //     this.locationTracker.toggleStart,
    //     ' is locationTracker toggleStart'
    //   );
    //   if (this.locationTracker.toggleStart) {
    //     // this.logger.info(
    //     //   'updateNewReslts func inside IF stmt; meaning myLocation was defined and not null???'
    //     // );
    //     if (this.myLocation['lat'] !== lat && this.myLocation['lng'] !== lng) {
    //       // let originalMyLoc = this.myLocation;
    //       this.myLocation = {
    //         lat: lat,
    //         lng: lng,
    //         error: null
    //       };
    //       this.logger.info(
    //         this.myLocation, ': myLocation must have been chnaged from ->'
    //       );
    //       // this.logger.info(
    //       //   this.myLocation +  ': myLocation must have been chnaged from ->' +
    //       //   originalMyLoc
    //       // );
    //       this.getClosestTenLocations(this.myLocation, true);
    //     } else {
    //       //** do nothing */
    //       // this.logger.info('no change in myLocation');
    //       this.getClosestTenLocations(this.myLocation, true);
    //     }
    //   } else {
    //     // this.logger.info('updateNewResults will leave now bc tracker is not on');
    //   }
    // }
    /**
     * /////////////////////////////////////////////////////////////////
     * ///////////// END OF Closest Locatio Features ///////////////////
     * /////////////////////////////////////////////////////////////////
     */
    openEmailDisclaimer() {
        let message = this.translate.instant('By providing your email address, you give explicit consent to BitPay to use your email address to send you email notifications about payments.');
        let title = this.translate.instant('Privacy Policy update');
        let okText = this.translate.instant('Accept');
        let cancelText = this.translate.instant('Disable notifications');
        this.popupProvider
            .ionicConfirm(title, message, okText, cancelText)
            .then(ok => {
            if (ok) {
                // Accept new Privacy Policy
                this.persistenceProvider.setEmailLawCompliance('accepted');
            }
            else {
                // Disable email notifications
                this.persistenceProvider.setEmailLawCompliance('rejected');
                this.emailProvider.updateEmail({
                    enabled: false,
                    email: 'null@email'
                });
            }
        });
    }
    checkEmailLawCompliance() {
        setTimeout(() => {
            if (this.emailProvider.getEmailIfEnabled()) {
                this.persistenceProvider.getEmailLawCompliance().then(value => {
                    if (!value)
                        this.openEmailDisclaimer();
                });
            }
        }, 2000);
    }
    startUpdatingWalletId(walletId) {
        this.updatingWalletId[walletId] = true;
    }
    stopUpdatingWalletId(walletId) {
        setTimeout(() => {
            this.updatingWalletId[walletId] = false;
        }, 10000);
    }
    checkHomeTip() {
        this.persistenceProvider.getHomeTipAccepted().then((value) => {
            this.homeTip = value == 'accepted' ? false : true;
        });
    }
    hideHomeTip() {
        this.persistenceProvider.setHomeTipAccepted('accepted');
        this.homeTip = false;
    }
    checkFeedbackInfo() {
        this.persistenceProvider.getFeedbackInfo().then(info => {
            if (!info) {
                this.initFeedBackInfo();
            }
            else {
                let feedbackInfo = info;
                // Check if current version is greater than saved version
                let currentVersion = this.releaseProvider.getCurrentAppVersion();
                let savedVersion = feedbackInfo.version;
                let isVersionUpdated = this.feedbackProvider.isVersionUpdated(currentVersion, savedVersion);
                if (!isVersionUpdated) {
                    this.initFeedBackInfo();
                    return;
                }
                let now = moment().unix();
                let timeExceeded = now - feedbackInfo.time >= 24 * 7 * 60 * 60;
                this.showRateCard = timeExceeded && !feedbackInfo.sent;
                this.showCard.setShowRateCard(this.showRateCard);
            }
        });
    }
    initFeedBackInfo() {
        this.persistenceProvider.setFeedbackInfo({
            time: moment().unix(),
            version: this.releaseProvider.getCurrentAppVersion(),
            sent: false
        });
        this.showRateCard = false;
    }
    updateWallet(walletId) {
        if (this.updatingWalletId[walletId])
            return;
        this.startUpdatingWalletId(walletId);
        let wallet = this.profileProvider.getWallet(walletId);
        this.walletProvider
            .getStatus(wallet, {})
            .then(status => {
            wallet.status = status;
            wallet.error = null;
            this.profileProvider.setLastKnownBalance(wallet.id, wallet.status.availableBalanceStr);
            this.updateTxps();
            this.stopUpdatingWalletId(walletId);
        })
            .catch(err => {
            this.logger.error(err);
            this.stopUpdatingWalletId(walletId);
        });
    }
    updateAllWallets() {
        let foundMessage = false;
        if (_.isEmpty(this.wallets))
            return;
        let i = this.wallets.length;
        let j = 0;
        let pr = ((wallet, cb) => {
            this.walletProvider
                .getStatus(wallet, {})
                .then(status => {
                wallet.status = status;
                wallet.error = null;
                if (!foundMessage && !_.isEmpty(status.serverMessage)) {
                    this.serverMessage = status.serverMessage;
                    foundMessage = true;
                }
                this.profileProvider.setLastKnownBalance(wallet.id, wallet.status.availableBalanceStr);
                return cb();
            })
                .catch(err => {
                wallet.error =
                    err === 'WALLET_NOT_REGISTERED'
                        ? 'Wallet not registered'
                        : this.bwcErrorProvider.msg(err);
                this.logger.warn(this.bwcErrorProvider.msg(err, 'Error updating status for ' + wallet.name));
                return cb();
            });
        }).bind(this);
        _.each(this.wallets, wallet => {
            pr(wallet, () => {
                if (++j == i) {
                    this.updateTxps();
                }
            });
        });
    }
    checkUpdate() {
        this.releaseProvider
            .getLatestAppVersion()
            .toPromise()
            .then(version => {
            this.logger.debug('Current app version:', version);
            var result = this.releaseProvider.checkForUpdates(version);
            this.logger.debug('Update available:', result.updateAvailable);
            if (result.updateAvailable) {
                this.newRelease = true;
                this.updateText = this.replaceParametersProvider.replace(this.translate.instant('There is a new version of {{nameCase}} available'), { nameCase: this.appProvider.info.nameCase });
            }
        })
            .catch(err => {
            this.logger.error('Error getLatestAppVersion', err);
        });
    }
    openServerMessageLink() {
        let url = this.serverMessage.link;
        this.externalLinkProvider.open(url);
    }
    goToAddView() {
        this.navCtrl.push(AddPage);
    }
    goToWalletDetails(wallet) {
        if (this.showReorderBtc || this.showReorderBch)
            return;
        if (!wallet.isComplete()) {
            this.navCtrl.push(CopayersPage, {
                walletId: wallet.credentials.walletId
            });
            return;
        }
        this.navCtrl.push(WalletDetailsPage, {
            walletId: wallet.credentials.walletId
        });
    }
    goToLocationDetails(loc_id, data) {
        if (data == null || this.localJson == null || (!data || !this.localJson)) {
            return this.showATMLocationsError();
        }
        this.navCtrl.push(AtmLocationsPage, {
            locationId: loc_id,
            dataSet: data,
            // title: data.title,
            // name: data.name,
            // lat: data.lat,
            // lng: data.lng,
            // zipcode: data.zipcode,
            // street: data.street,
            // city: data.city,
            // state: data.state,
            // country: data.country,
            // hours: data.hours,
            // img: data.img,
            serverJson: this.locations,
            localJson: this.localJson,
            geolocation: this.myLocation
        });
        this.logger.info(data);
    }
    showATMLocationsError() {
        const alert = this.alertCtrl.create({
            title: 'Some connection errors Occured',
            subTitle: 'Sorry, please come back later and refresh the app!',
            buttons: ['OK']
        });
        alert.present();
    }
    openNotificationModal(n) {
        let wallet = this.profileProvider.getWallet(n.walletId);
        if (n.txid) {
            this.navCtrl.push(TxDetailsPage, { walletId: n.walletId, txid: n.txid });
        }
        else {
            var txp = _.find(this.txps, {
                id: n.txpId
            });
            if (txp) {
                this.openTxpModal(txp);
            }
            else {
                this.onGoingProcessProvider.set('loadingTxInfo');
                this.walletProvider
                    .getTxp(wallet, n.txpId)
                    .then(txp => {
                    var _txp = txp;
                    this.onGoingProcessProvider.clear();
                    this.openTxpModal(_txp);
                })
                    .catch(() => {
                    this.onGoingProcessProvider.clear();
                    this.logger.warn('No txp found');
                    let title = this.translate.instant('Error');
                    let subtitle = this.translate.instant('Transaction not found');
                    return this.popupProvider.ionicAlert(title, subtitle);
                });
            }
        }
    }
    reorderBtc() {
        this.showReorderBtc = !this.showReorderBtc;
    }
    reorderBch() {
        this.showReorderBch = !this.showReorderBch;
    }
    reorderWalletsBtc(indexes) {
        let element = this.walletsBtc[indexes.from];
        this.walletsBtc.splice(indexes.from, 1);
        this.walletsBtc.splice(indexes.to, 0, element);
        _.each(this.walletsBtc, (wallet, index) => {
            this.profileProvider.setWalletOrder(wallet.id, index);
        });
    }
    reorderWalletsBch(indexes) {
        let element = this.walletsBch[indexes.from];
        this.walletsBch.splice(indexes.from, 1);
        this.walletsBch.splice(indexes.to, 0, element);
        _.each(this.walletsBch, (wallet, index) => {
            this.profileProvider.setWalletOrder(wallet.id, index);
        });
    }
    goToDownload() {
        let url = 'https://github.com/getcoinscom/gcwallet/releases/latest';
        let optIn = true;
        let title = this.translate.instant('Update Available');
        let message = this.translate.instant('An update to this app is available. For your security, please update to the latest version.');
        let okText = this.translate.instant('View Update');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    openTxpModal(tx) {
        let modal = this.modalCtrl.create(TxpDetailsPage, { tx }, { showBackdrop: false, enableBackdropDismiss: false });
        modal.present();
    }
    openProposalsPage() {
        this.navCtrl.push(ProposalsPage);
    }
    openActivityPage() {
        this.navCtrl.push(ActivityPage);
    }
    goTo(page) {
        const pageMap = {
            AmazonPage,
            BitPayCardIntroPage,
            CoinbasePage,
            GlideraPage,
            MercadoLibrePage,
            ShapeshiftPage
        };
        this.navCtrl.push(pageMap[page]);
    }
    goToCard(cardId) {
        this.navCtrl.push(BitPayCardPage, { id: cardId });
    }
    doRefresh(refresher) {
        refresher.pullMin = 90;
        this.updateAllWallets();
        this.getNotifications();
        this.searchAgain();
        this.warnToRefresh = false;
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    callCustomerSupport() {
        let url = 'tel:+1-860-800-2646';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('You can call us now at 860-800-2646');
        let okText = this.translate.instant('Call');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
    openGCSiteLink() {
        let url = 'https://www.getcoins.com';
        let optIn = true;
        let title = null;
        let message = this.translate.instant('Go visit our site at www.getcoins.com');
        let okText = this.translate.instant('Open');
        let cancelText = this.translate.instant('Go Back');
        this.externalLinkProvider.open(url, optIn, title, message, okText, cancelText);
    }
};
__decorate([
    ViewChild('showCard'),
    __metadata("design:type", Object)
], HomePage.prototype, "showCard", void 0);
HomePage = __decorate([
    Component({
        selector: 'page-home',
        templateUrl: 'home.html'
    }),
    __metadata("design:paramtypes", [Platform,
        NavController,
        ProfileProvider,
        ReleaseProvider,
        WalletProvider,
        BwcErrorProvider,
        Logger,
        Events,
        ConfigProvider,
        ExternalLinkProvider,
        OnGoingProcessProvider,
        PopupProvider,
        ModalController,
        AddressBookProvider,
        AppProvider,
        PlatformProvider,
        HomeIntegrationsProvider,
        PersistenceProvider,
        FeedbackProvider,
        BitPayCardProvider,
        TranslateService,
        EmailNotificationsProvider,
        ReplaceParametersProvider,
        AtmLocationProvider,
        AlertController,
        Geolocation,
        LocationTrackerProvider,
        OpenNativeSettings // public geoProvider: GeolocationProvider // private diagnostic: Diagnostic
    ])
], HomePage);
export { HomePage };
// interface OpenHours {
//   day: string;
//   open: string;
//   close: string;
// }
// // interface ConvertedOpenHours {
// //   [index: number]: { day: string; open: string; close: string };
// // }
// interface StringArray {
//   [index: string]: string;
// }
//# sourceMappingURL=home.js.map