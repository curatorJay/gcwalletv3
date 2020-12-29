var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { Logger } from '../../providers/logger/logger';
// import { AtmLocationProvider } from '../../providers/atm-location/atm-location';
/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let LocationTrackerProvider = class LocationTrackerProvider {
    constructor(http, zone, geolocation, backgroundGeolocation, logger // public atmLocationProvider: AtmLocationProvider
    ) {
        this.http = http;
        this.zone = zone;
        this.geolocation = geolocation;
        this.backgroundGeolocation = backgroundGeolocation;
        this.logger = logger;
        this.lat = 0;
        this.lng = 0;
        this.toggleStart = false;
        this.toggleStop = false;
        this.logger.info('Hello LocationTrackerProvider Provider');
    }
    startTracking(callback) {
        this.toggleStart = true;
        // setInterval(() => {
        //   this.updateNewResults();
        //   console.log('every 5ec tracking started!');
        // }, 5 * 1000); // 60 * 1000 milsec
        // Background Tracking
        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 20,
            distanceFilter: 10,
            debug: true,
            interval: 2000
        };
        this.backgroundGeolocation.configure(config).subscribe(location => {
            // console.log(
            //   'BackgroundGeolocation:  ' +
            //     location.latitude +
            //     ',' +
            //     location.longitude
            // );
            this.logger.info('BackgroundGeolocation:  ' +
                location.latitude +
                ',' +
                location.longitude);
            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = location.latitude;
                this.lng = location.longitude;
                // this.atmLocationProvider.updateNewResults(this.lat, this.lng);//** this cause a huge error with "cannot access uninitialized values" or "AtmLocationProvider cannot access". THis is due to calling atmLocationProvider inside another provider, location-tracker, and vice versa, and they are both used in home.ts, causing the error forever looping..*/
                callback(this.lat, this.lng);
            });
        }, err => {
            // console.log(err);
            this.logger.warn(err);
        });
        // Turn ON the background-geolocation system.
        this.backgroundGeolocation.start();
        // Foreground Tracking
        let options = {
            frequency: 3000,
            enableHighAccuracy: true
        };
        this.watch = this.geolocation
            .watchPosition(options)
            .filter((p) => p.code === undefined)
            .subscribe((position) => {
            // console.log(position);
            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                callback(this.lat, this.lng);
            });
        });
    }
    stopTracking() {
        this.toggleStop = true;
        // console.log('stopTracking');
        this.backgroundGeolocation.finish();
        this.watch.unsubscribe();
    }
};
LocationTrackerProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient,
        NgZone,
        Geolocation,
        BackgroundGeolocation,
        Logger // public atmLocationProvider: AtmLocationProvider
    ])
], LocationTrackerProvider);
export { LocationTrackerProvider };
//# sourceMappingURL=location-tracker.js.map