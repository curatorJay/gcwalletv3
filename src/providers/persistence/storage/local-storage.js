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
import * as _ from 'lodash';
import { KeyAlreadyExistsError } from './istorage';
// providers
import { Logger } from '../../logger/logger';
import { PlatformProvider } from '../../platform/platform';
let LocalStorage = class LocalStorage {
    constructor(platformProvider, logger) {
        this.platformProvider = platformProvider;
        this.logger = logger;
        this.ls =
            typeof window.localStorage !== 'undefined' ? window.localStorage : null;
        if (!this.ls)
            throw new Error('localstorage not available');
        if (this.platformProvider.isNW) {
            this.logger.info('Overwritting localstorage with chrome storage for NW.JS');
            let ts = this.ls.getItem('migrationToChromeStorage');
            let p = this.ls.getItem('profile');
            // Need migration?
            if (!ts && p) {
                this.logger.info('### MIGRATING DATA! TO CHROME STORAGE');
                let j = 0;
                for (let i = 0; i < localStorage.length; i++) {
                    let k = this.ls.key(i);
                    let v = this.ls.getItem(k);
                    this.logger.debug('   Key: ' + k);
                    this.set(k, v).then(() => {
                        j++;
                        if (j == localStorage.length) {
                            this.logger.info('### MIGRATION DONE');
                            this.ls.setItem('migrationToChromeStorage', Date.now().toString());
                            this.ls = chrome.storage.local;
                        }
                    });
                }
            }
            else if (p) {
                this.logger.info('# Data already migrated to Chrome storage on ' + ts);
            }
        }
    }
    processingData(v) {
        if (!v)
            return null;
        if (!_.isString(v))
            return v;
        let parsed;
        try {
            parsed = JSON.parse(v);
        }
        catch (e) {
            // TODO parse is not necessary
        }
        return parsed || v;
    }
    get(k) {
        return new Promise(resolve => {
            if (this.platformProvider.isNW) {
                chrome.storage.local.get(k, data => {
                    let v = data[k];
                    return resolve(this.processingData(v));
                });
            }
            else {
                let v = this.ls.getItem(k);
                return resolve(this.processingData(v));
            }
        });
    }
    set(k, v) {
        return new Promise(resolve => {
            if (_.isObject(v))
                v = JSON.stringify(v);
            if (!_.isString(v))
                v = v.toString();
            if (this.platformProvider.isNW) {
                let obj = {};
                obj[k] = v;
                chrome.storage.local.set(obj);
            }
            else {
                this.ls.setItem(k, v);
            }
            resolve();
        });
    }
    remove(k) {
        return new Promise(resolve => {
            if (this.platformProvider.isNW) {
                chrome.storage.local.remove(k);
            }
            else {
                this.ls.removeItem(k);
            }
            resolve();
        });
    }
    create(k, v) {
        return this.get(k).then(data => {
            if (data)
                throw new KeyAlreadyExistsError();
            this.set(k, v);
        });
    }
};
LocalStorage = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PlatformProvider,
        Logger])
], LocalStorage);
export { LocalStorage };
//# sourceMappingURL=local-storage.js.map