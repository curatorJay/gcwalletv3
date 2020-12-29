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
import { map } from 'rxjs/operators';
import { AppProvider } from '../../providers/app/app';
let ReleaseProvider = class ReleaseProvider {
    constructor(http, app) {
        this.http = http;
        this.app = app;
        this.LATEST_RELEASE_URL =
            'https://api.github.com/repos/getcoinscom/gcwallet/releases/latest';
        this.appVersion = this.app.info.version;
    }
    getCurrentAppVersion() {
        return this.appVersion;
    }
    getLatestAppVersion() {
        return this.http.get(this.LATEST_RELEASE_URL).pipe(map(x => x['tag_name']));
    }
    verifyTagFormat(tag) {
        var regex = /^v?\d+\.\d+\.\d+$/i;
        return regex.exec(tag);
    }
    formatTagNumber(tag) {
        var formattedNumber = tag.replace(/^v/i, '').split('.');
        return {
            major: +formattedNumber[0],
            minor: +formattedNumber[1],
            patch: +formattedNumber[2]
        };
    }
    checkForUpdates(latestVersion, currentVersion) {
        if (!currentVersion)
            currentVersion = this.appVersion;
        let result = {
            updateAvailable: null,
            availableVersion: null,
            error: null
        };
        if (!this.verifyTagFormat(currentVersion))
            result.error =
                'Cannot verify the format of version tag: ' + currentVersion;
        if (!this.verifyTagFormat(latestVersion))
            result.error =
                'Cannot verify the format of latest release tag: ' + latestVersion;
        let current = this.formatTagNumber(currentVersion);
        let latest = this.formatTagNumber(latestVersion);
        if (latest.major > current.major ||
            (latest.major == current.major && latest.minor > current.minor) ||
            (latest.minor == current.minor && latest.patch > current.patch)) {
            result.updateAvailable = true;
            result.availableVersion = latestVersion;
        }
        return result;
    }
};
ReleaseProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient, AppProvider])
], ReleaseProvider);
export { ReleaseProvider };
//# sourceMappingURL=release.js.map