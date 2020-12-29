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
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
/*
  Generated class for the GeolocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let GeolocationProvider = class GeolocationProvider {
    constructor(http, geo) {
        this.http = http;
        this.geo = geo;
        this.myGeolocation = {};
        console.log('Hello GeolocationProvider Provider');
    }
    //** get and watch user's geolocation  */
    loadGeolocation() {
        // this.loading = true;
        this.options = {
            enableHighAccuracy: true
        };
        let getPosition = this.geo.getCurrentPosition(this.options).then((pos) => {
            console.log(pos, ' this is the position returned from the promise func');
            this.myGeolocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                error: null
            };
            // let test = this.checkit(this.myGeolocation);
            // console.log(test, 'is the test results');
            // // this.newResults
            console.log(pos, ' is the geoposition pos');
            console.log(this.myGeolocation, ' is my location??');
            // console.log(this.newResults);
            return this.myGeolocation;
        }, (err) => {
            this.myGeolocation = {
                lat: 0,
                lng: 0,
                error: err.message
            };
            console.log(this.myGeolocation);
            console.log('error : ' + err.message);
            return this.myGeolocation;
        });
        return getPosition;
        // ).then(
        //   res => {
        //     this.newResults = this.atmLocationProvider
        //       .getLocationsPromise(res, true)
        //       .then(
        //         res => {
        //           console.log(res, 'this res');
        //           this.newResults = res;
        //           console.log(this.newResults, 'this new results');
        //           this.loading = false;
        //         },
        //         err => {
        //           this.newResults = this.atmLocationProvider
        //             .getLocationsPromise(this.myGeolocation, true)
        //             .then(
        //               res => {
        //                 console.log(res, 'this res');
        //                 this.newResults = res;
        //                 console.log(this.newResults, 'this new results');
        //               },
        //               err => {
        //                 console.log(err);
        //               }
        //             );
        //           console.log(err);
        //           this.loading = false;
        //         }
        //       );
        //   },
        //   msg => {
        //     console.log(msg);
        //   }
        // );
        // this.geo
        //   .getCurrentPosition()
        //   .then(res => {
        //     console.log('geolocation response!');
        //     // res.coords.latitude
        //     // res.coords.longitude
        //     this.myGeolocation = {
        //       lat: res.coords.latitude,
        //       lng: res.coords.longitude
        //       // error: null
        //     };
        //     console.log(res, 'is what we get');
        //     console.log(this.myGeolocation, 'is my object');
        //   })
        //   .catch(error => {
        //     this.myGeolocation = {
        //       lat: 0,
        //       lng: 0
        //       // error: error
        //     };
        //     console.log('Error getting location', error);
        //     console.log(this.myGeolocation, 'is my object');
        //   });
    }
    watchGeolocation() {
        console.log(this.myGeolocation, ' is this.myGeolocation');
        this.watch = this.geo.watchPosition();
        this.watch.subscribe(data => {
            // data can be a set of coordinates, or an error (if an error occurred).
            // data.coords.latitude
            // data.coords.longitude
            console.log(data, ' is watched geo data');
            this.myGeolocation = {
                lat: data.coords.latitude,
                lng: data.coords.longitude,
                error: null
            };
        }, err => {
            console.log(err, ' is error from watchGeolocation');
            // this.myGeolocation = {
            //   lat: this.myGeolocation.lat,
            //   lng: this.myGeolocation.lng,
            //   error: err
            // };
        });
    }
};
GeolocationProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient, Geolocation])
], GeolocationProvider);
export { GeolocationProvider };
//# sourceMappingURL=geolocation.js.map