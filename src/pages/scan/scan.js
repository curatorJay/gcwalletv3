var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, VERSION, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../providers/logger/logger';
// providers
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { IncomingDataProvider } from '../../providers/incoming-data/incoming-data';
import { PlatformProvider } from '../../providers/platform/platform';
import { ScanProvider } from '../../providers/scan/scan';
// pages
import { PaperWalletPage } from '../paper-wallet/paper-wallet';
import { AmountPage } from '../send/amount/amount';
import { AddressbookAddPage } from '../settings/addressbook/add/add';
import env from '../../environments';
let ScanPage = class ScanPage {
    constructor(navCtrl, scanProvider, platform, incomingDataProvider, events, externalLinkProvider, logger, translate, navParams) {
        this.navCtrl = navCtrl;
        this.scanProvider = scanProvider;
        this.platform = platform;
        this.incomingDataProvider = incomingDataProvider;
        this.events = events;
        this.externalLinkProvider = externalLinkProvider;
        this.logger = logger;
        this.translate = translate;
        this.navParams = navParams;
        this.ngVersion = VERSION.full;
        this.hasCameras = false;
        this.isCameraSelected = false;
        this.browserScanEnabled = false;
        this.canEnableLight = true;
        this.canChangeCamera = true;
        this.scannerStates = {
            unauthorized: 'unauthorized',
            denied: 'denied',
            unavailable: 'unavailable',
            loading: 'loading',
            visible: 'visible'
        };
        this.scannerIsAvailable = true;
        this.scannerHasPermission = false;
        this.scannerIsDenied = false;
        this.scannerIsRestricted = false;
        this.canOpenSettings = false;
        this.isCordova = this.platform.isCordova;
        if (this.navParams.data.fromAddressbook) {
            this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
            this.tabBarElement.style.display = 'none';
        }
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad ScanPage');
    }
    ionViewWillLeave() {
        this.events.unsubscribe('finishIncomingDataMenuEvent');
        this.events.unsubscribe('scannerServiceInitialized');
        if (this.navParams.data.fromAddressbook) {
            this.tabBarElement.style.display = 'flex';
        }
        if (!this.isCordova) {
            this.scanner.resetScan();
        }
        else {
            this.cameraToggleActive = false;
            this.lightActive = false;
            this.scanProvider.frontCameraEnabled = false;
            this.scanProvider.deactivate();
        }
    }
    ionViewWillEnter() {
        if (!env.activateScanner) {
            // test scanner visibility in E2E mode
            this.selectedDevice = true;
            this.hasPermission = true;
            return;
        }
        this.events.subscribe('finishIncomingDataMenuEvent', data => {
            if (!this.isCordova) {
                this.scanner.resetScan();
            }
            switch (data.redirTo) {
                case 'AmountPage':
                    this.sendPaymentToAddress(data.value, data.coin);
                    break;
                case 'AddressBookPage':
                    this.addToAddressBook(data.value);
                    break;
                case 'OpenExternalLink':
                    this.goToUrl(data.value);
                    break;
                case 'PaperWalletPage':
                    this.scanPaperWallet(data.value);
                    break;
                default:
                    if (this.isCordova) {
                        this.activate();
                    }
                    else if (this.isCameraSelected) {
                        this.scanner.startScan(this.selectedDevice);
                    }
            }
        });
        if (!this.isCordova) {
            if (!this.isCameraSelected) {
                this.scanner.camerasFound.subscribe((devices) => {
                    this.hasCameras = true;
                    this.availableDevices = devices;
                    this.onDeviceSelectChange();
                });
                this.scanner.camerasNotFound.subscribe(() => {
                    this.logger.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
                });
                this.scanner.permissionResponse.subscribe((answer) => {
                    this.hasPermission = answer;
                });
            }
            else {
                this.scanner.startScan(this.selectedDevice);
            }
        }
        else {
            // try initializing and refreshing status any time the view is entered
            if (this.scannerHasPermission) {
                this.activate();
            }
            else {
                if (!this.scanProvider.isInitialized()) {
                    this.scanProvider.gentleInitialize().then(() => {
                        this.authorize();
                    });
                }
                else {
                    this.authorize();
                }
            }
            this.events.subscribe('scannerServiceInitialized', () => {
                this.logger.debug('Scanner initialization finished, reinitializing scan view...');
                this._refreshScanView();
            });
        }
    }
    goToUrl(url) {
        this.externalLinkProvider.open(url);
    }
    sendPaymentToAddress(bitcoinAddress, coin) {
        this.navCtrl.push(AmountPage, { toAddress: bitcoinAddress, coin });
    }
    addToAddressBook(bitcoinAddress) {
        this.navCtrl.push(AddressbookAddPage, { addressbookEntry: bitcoinAddress });
    }
    scanPaperWallet(privateKey) {
        this.navCtrl.push(PaperWalletPage, { privateKey });
    }
    updateCapabilities() {
        let capabilities = this.scanProvider.getCapabilities();
        this.scannerIsAvailable = capabilities.isAvailable;
        this.scannerHasPermission = capabilities.hasPermission;
        this.scannerIsDenied = capabilities.isDenied;
        this.scannerIsRestricted = capabilities.isRestricted;
        this.canEnableLight = capabilities.canEnableLight;
        this.canChangeCamera = capabilities.canChangeCamera;
        this.canOpenSettings = capabilities.canOpenSettings;
    }
    handleCapabilities() {
        // always update the view
        if (!this.scanProvider.isInitialized()) {
            this.currentState = this.scannerStates.loading;
        }
        else if (!this.scannerIsAvailable) {
            this.currentState = this.scannerStates.unavailable;
        }
        else if (this.scannerIsDenied) {
            this.currentState = this.scannerStates.denied;
        }
        else if (this.scannerIsRestricted) {
            this.currentState = this.scannerStates.denied;
        }
        else if (!this.scannerHasPermission) {
            this.currentState = this.scannerStates.unauthorized;
        }
        this.logger.debug('Scan view state set to: ' + this.currentState);
    }
    _refreshScanView() {
        this.updateCapabilities();
        this.handleCapabilities();
        if (this.scannerHasPermission) {
            this.activate();
        }
    }
    activate() {
        this.scanProvider.activate().then(() => {
            this.updateCapabilities();
            this.handleCapabilities();
            this.logger.debug('Scanner activated, setting to visible...');
            this.currentState = this.scannerStates.visible;
            // resume preview if paused
            this.scanProvider.resumePreview();
            this.scanProvider.scan().then((contents) => {
                this.scanProvider.pausePreview();
                this.handleSuccessfulScan(contents);
            });
        });
    }
    handleSuccessfulScan(contents) {
        this.logger.debug('Scan returned: "' + contents + '"');
        let fromAddressbook = this.navParams.data.fromAddressbook;
        if (fromAddressbook) {
            this.events.publish('update:address', { value: contents });
            this.navCtrl.pop();
        }
        else {
            this.incomingDataProvider.redir(contents, 'ScanPage');
        }
    }
    authorize() {
        this.scanProvider.initialize().then(() => {
            this._refreshScanView();
        });
    }
    attemptToReactivate() {
        this.scanProvider.reinitialize();
    }
    openSettings() {
        this.scanProvider.openSettings();
    }
    toggleLight() {
        this.scanProvider
            .toggleLight()
            .then(resp => {
            this.lightActive = resp;
        })
            .catch(error => {
            this.logger.warn('scanner error: ' + error);
        });
    }
    toggleCamera() {
        this.scanProvider
            .toggleCamera()
            .then(resp => {
            this.cameraToggleActive = resp;
            this.lightActive = false;
        })
            .catch(error => {
            this.logger.warn('scanner error: ' + error);
        });
    }
    handleQrCodeResult(resultString) {
        this.scanner.resetScan();
        setTimeout(() => {
            this.handleSuccessfulScan(resultString);
        }, 0);
    }
    onDeviceSelectChange() {
        if (!this.isCameraSelected) {
            for (const device of this.availableDevices) {
                if (device.kind == 'videoinput') {
                    this.selectedDevice = this.scanner.getDeviceById(device.deviceId);
                    this.isCameraSelected = true;
                    break;
                }
            }
        }
    }
};
__decorate([
    ViewChild('scanner'),
    __metadata("design:type", Object)
], ScanPage.prototype, "scanner", void 0);
ScanPage = __decorate([
    Component({
        selector: 'page-scan',
        templateUrl: 'scan.html',
        providers: [ScanProvider]
    }),
    __metadata("design:paramtypes", [NavController,
        ScanProvider,
        PlatformProvider,
        IncomingDataProvider,
        Events,
        ExternalLinkProvider,
        Logger,
        TranslateService,
        NavParams])
], ScanPage);
export { ScanPage };
//# sourceMappingURL=scan.js.map