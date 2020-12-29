var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { QRScanner } from '@ionic-native/qr-scanner';
import { Events } from 'ionic-angular';
import { Logger } from '../../providers/logger/logger';
import { PlatformProvider } from '../platform/platform';
let ScanProvider = class ScanProvider {
    constructor(qrScanner, platform, logger, events) {
        this.qrScanner = qrScanner;
        this.platform = platform;
        this.logger = logger;
        this.events = events;
        this.isDesktop = !this.platform.isCordova;
        this.isAvailable = true;
        this.hasPermission = false;
        this.isDenied = false;
        this.isRestricted = false;
        this.canEnableLight = false;
        this.canChangeCamera = false;
        this.canOpenSettings = false;
        this.backCamera = true;
        this.initializeStarted = false;
        this.initializeCompleted = false;
        this.scannerVisible = false;
        this.lightEnabled = false;
        this.frontCameraEnabled = false;
    }
    checkCapabilities(status) {
        this.logger.debug('scannerService is reviewing platform capabilities...');
        // Permission can be assumed on the desktop builds
        this.hasPermission = this.isDesktop || status.authorized ? true : false;
        this.isDenied = status.denied ? true : false;
        this.isRestricted = status.restricted ? true : false;
        this.canEnableLight = status.canEnableLight ? true : false;
        this.canChangeCamera = status.canChangeCamera ? true : false;
        this.canOpenSettings = status.canOpenSettings ? true : false;
        this.logCapabilities();
    }
    orIsNot(bool) {
        return bool ? '' : 'not ';
    }
    logCapabilities() {
        this.logger.debug('A camera is ' + this.orIsNot(this.isAvailable) + 'available to this app.');
        var access = 'not authorized';
        if (this.hasPermission)
            access = 'authorized';
        if (this.isDenied)
            access = 'denied';
        if (this.isRestricted)
            access = 'restricted';
        this.logger.debug('Camera access is ' + access + '.');
        this.logger.debug('Support for opening device settings is ' +
            this.orIsNot(this.canOpenSettings) +
            'available on this platform.');
        this.logger.debug('A light is ' +
            this.orIsNot(this.canEnableLight) +
            'available on this platform.');
        this.logger.debug('A second camera is ' +
            this.orIsNot(this.canChangeCamera) +
            'available on this platform.');
    }
    /**
     * Immediately return known capabilities of the current platform.
     */
    getCapabilities() {
        return {
            isAvailable: this.isAvailable,
            hasPermission: this.hasPermission,
            isDenied: this.isDenied,
            isRestricted: this.isRestricted,
            canEnableLight: this.canEnableLight,
            canChangeCamera: this.canChangeCamera,
            canOpenSettings: this.canOpenSettings
        };
    }
    /**
     * If camera access has been granted, pre-initialize the QRScanner. This method
     * can be safely called before the scanner is visible to improve perceived
     * scanner loading times.
     *
     * The `status` of QRScanner is returned to the callback.
     */
    gentleInitialize() {
        return new Promise(resolve => {
            if (this.initializeStarted && !this.isDesktop) {
                this.qrScanner.getStatus().then(status => {
                    this.completeInitialization(status);
                });
                return resolve();
            }
            this.initializeStarted = true;
            this.logger.debug('Trying to pre-initialize QRScanner.');
            if (!this.isDesktop) {
                this.qrScanner.getStatus().then(status => {
                    this.checkCapabilities(status);
                    if (status.authorized) {
                        this.logger.debug('Camera permission already granted.');
                        this.initialize().then(() => {
                            return resolve();
                        });
                    }
                    else {
                        this.logger.debug('QRScanner not authorized, waiting to initalize.');
                        this.completeInitialization(status);
                        return resolve();
                    }
                });
            }
            else {
                this.logger.debug('To avoid flashing the privacy light, we do not pre-initialize the camera on desktop.');
                return resolve();
            }
        });
    }
    reinitialize() {
        this.initializeCompleted = false;
        this.qrScanner.destroy();
        this.initialize();
    }
    initialize() {
        return new Promise(resolve => {
            this.logger.debug('Initializing scanner...');
            this.qrScanner
                .prepare()
                .then(status => {
                this.completeInitialization(status);
                return resolve();
            })
                .catch(err => {
                this.isAvailable = false;
                this.logger.error(err);
                // does not return `status` if there is an error
                this.qrScanner.getStatus().then(status => {
                    this.completeInitialization(status);
                    return resolve();
                });
            });
        });
    }
    completeInitialization(status) {
        this.checkCapabilities(status);
        this.initializeCompleted = true;
        this.events.publish('scannerServiceInitialized');
    }
    isInitialized() {
        return this.initializeCompleted;
    }
    isInitializeStarted() {
        return this.initializeStarted;
    }
    /**
     * (Re)activate the QRScanner, and cancel the timeouts if present.
     *
     * The `status` of QRScanner is passed to the callback when activation
     * is complete.
     */
    activate() {
        return new Promise(resolve => {
            this.logger.debug('Activating scanner...');
            this.qrScanner.show().then(status => {
                this.initializeCompleted = true;
                this.checkCapabilities(status);
                return resolve();
            });
        });
    }
    /**
     * Start a new scan.
     */
    scan() {
        return new Promise(resolve => {
            this.logger.debug('Scanning...');
            let scanSub = this.qrScanner.scan().subscribe((text) => {
                this.logger.debug('Scanned something', text);
                scanSub.unsubscribe(); // stop scanning
                return resolve(text);
            });
        });
    }
    pausePreview() {
        this.qrScanner.pausePreview();
    }
    resumePreview() {
        this.qrScanner.resumePreview();
    }
    /**
     * Deactivate the QRScanner. To balance user-perceived performance and power
     * consumption, this kicks off a countdown which will "sleep" the scanner
     * after a certain amount of time.
     *
     * The `status` of QRScanner is passed to the callback when deactivation
     * is complete.
     */
    deactivate() {
        this.logger.debug('Deactivating scanner...');
        if (this.lightEnabled) {
            this.qrScanner.disableLight();
            this.lightEnabled = false;
        }
        this.hide();
        this.destroy();
    }
    // Natively hide the QRScanner's preview
    // On mobile platforms, this can reduce GPU/power usage
    // On desktop, this fully turns off the camera (and any associated privacy lights)
    hide() {
        this.qrScanner.hide();
    }
    // Reduce QRScanner power/processing consumption by the maximum amount
    destroy() {
        this.qrScanner.destroy();
    }
    /**
     * Toggle the device light (if available).
     *
     * The callback receives a boolean which is `true` if the light is enabled.
     */
    toggleLight() {
        return new Promise((resolve, reject) => {
            this.logger.info('Toggling light...');
            if (this.lightEnabled) {
                this.qrScanner
                    .disableLight()
                    .then(() => {
                    this.lightEnabled = false;
                    return resolve(this.lightEnabled);
                })
                    .catch(err => {
                    this.logger.error('Scan Provider Error (disableLight)', err);
                    return reject(err);
                });
            }
            else {
                this.qrScanner
                    .enableLight()
                    .then(() => {
                    this.lightEnabled = true;
                    return resolve(this.lightEnabled);
                })
                    .catch(err => {
                    this.logger.error('Scan Provider Error (enableLight)', err);
                    return reject(err);
                });
            }
        });
    }
    /**
     * Switch cameras (if a second camera is available).
     *
     * The `status` of QRScanner is passed to the callback when activation
     * is complete.
     */
    toggleCamera() {
        return new Promise((resolve, reject) => {
            this.logger.info('Toggling camera...');
            if (this.frontCameraEnabled) {
                this.qrScanner
                    .useBackCamera()
                    .then(() => {
                    this.frontCameraEnabled = false;
                    return resolve(this.frontCameraEnabled);
                })
                    .catch(err => {
                    this.logger.error('Scan Provider Error (useBackCamera)', err);
                    return reject(err);
                });
            }
            else {
                this.qrScanner
                    .useFrontCamera()
                    .then(() => {
                    this.frontCameraEnabled = true;
                    return resolve(this.frontCameraEnabled);
                })
                    .catch(err => {
                    this.logger.error('Scan Provider Error (useFrontCamera)', err);
                    return reject(err);
                });
            }
        });
    }
    openSettings() {
        this.logger.debug('Attempting to open device settings...');
        this.qrScanner.openSettings();
    }
};
ScanProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [QRScanner,
        PlatformProvider,
        Logger,
        Events])
], ScanProvider);
export { ScanProvider };
//# sourceMappingURL=scan.js.map