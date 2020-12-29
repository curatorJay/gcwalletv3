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
import { TranslateService } from '@ngx-translate/core';
import { Logger } from '../../providers/logger/logger';
import { PersistenceProvider } from '../../providers/persistence/persistence';
import { BwcProvider } from '../bwc/bwc';
import * as _ from 'lodash';
let AddressBookProvider = class AddressBookProvider {
    constructor(bwcProvider, logger, persistenceProvider, translate) {
        this.bwcProvider = bwcProvider;
        this.logger = logger;
        this.persistenceProvider = persistenceProvider;
        this.translate = translate;
        this.logger.info('AddressBookProvider initialized.');
    }
    getNetwork(address) {
        let network;
        try {
            network = this.bwcProvider.getBitcore().Address(address).network.name;
        }
        catch (e) {
            this.logger.warn('No valid bitcoin address. Trying bitcoin cash...');
            network = this.bwcProvider.getBitcoreCash().Address(address).network.name;
        }
        return network;
    }
    get(addr) {
        return new Promise((resolve, reject) => {
            this.persistenceProvider
                .getAddressBook('testnet')
                .then(ab => {
                if (ab && _.isString(ab))
                    ab = JSON.parse(ab);
                if (ab && ab[addr])
                    return resolve(ab[addr]);
                this.persistenceProvider
                    .getAddressBook('livenet')
                    .then(ab => {
                    if (ab && _.isString(ab))
                        ab = JSON.parse(ab);
                    if (ab && ab[addr])
                        return resolve(ab[addr]);
                    return resolve();
                })
                    .catch(() => {
                    return reject();
                });
            })
                .catch(() => {
                return reject();
            });
        });
    }
    list() {
        return new Promise((resolve, reject) => {
            this.persistenceProvider
                .getAddressBook('testnet')
                .then(ab => {
                if (ab && _.isString(ab))
                    ab = JSON.parse(ab);
                ab = ab || {};
                this.persistenceProvider
                    .getAddressBook('livenet')
                    .then(ab2 => {
                    if (ab2 && _.isString(ab))
                        ab2 = JSON.parse(ab2);
                    ab2 = ab2 || {};
                    return resolve(_.defaults(ab2, ab));
                })
                    .catch(err => {
                    return reject(err);
                });
            })
                .catch(() => {
                let msg = this.translate.instant('Could not get the Addressbook');
                return reject(msg);
            });
        });
    }
    add(entry) {
        return new Promise((resolve, reject) => {
            var network = this.getNetwork(entry.address);
            if (_.isEmpty(network)) {
                let msg = this.translate.instant('Not valid bitcoin address');
                return reject(msg);
            }
            this.persistenceProvider
                .getAddressBook(network)
                .then(ab => {
                if (ab && _.isString(ab))
                    ab = JSON.parse(ab);
                ab = ab || {};
                if (_.isArray(ab))
                    ab = {}; // No array
                if (ab[entry.address]) {
                    let msg = this.translate.instant('Entry already exist');
                    return reject(msg);
                }
                ab[entry.address] = entry;
                this.persistenceProvider
                    .setAddressBook(network, JSON.stringify(ab))
                    .then(() => {
                    this.list()
                        .then(ab => {
                        return resolve(ab);
                    })
                        .catch(err => {
                        return reject(err);
                    });
                })
                    .catch(() => {
                    let msg = this.translate.instant('Error adding new entry');
                    return reject(msg);
                });
            })
                .catch(err => {
                return reject(err);
            });
        });
    }
    remove(addr) {
        return new Promise((resolve, reject) => {
            var network = this.getNetwork(addr);
            if (_.isEmpty(network)) {
                let msg = this.translate.instant('Not valid bitcoin address');
                return reject(msg);
            }
            this.persistenceProvider
                .getAddressBook(network)
                .then(ab => {
                if (ab && _.isString(ab))
                    ab = JSON.parse(ab);
                ab = ab || {};
                if (_.isEmpty(ab)) {
                    let msg = this.translate.instant('Addressbook is empty');
                    return reject(msg);
                }
                if (!ab[addr]) {
                    let msg = this.translate.instant('Entry does not exist');
                    return reject(msg);
                }
                delete ab[addr];
                this.persistenceProvider
                    .setAddressBook(network, JSON.stringify(ab))
                    .then(() => {
                    this.list()
                        .then(ab => {
                        return resolve(ab);
                    })
                        .catch(err => {
                        return reject(err);
                    });
                })
                    .catch(() => {
                    let msg = this.translate.instant('Error deleting entry');
                    return reject(msg);
                });
            })
                .catch(err => {
                return reject(err);
            });
        });
    }
    removeAll() {
        return new Promise((resolve, reject) => {
            this.persistenceProvider
                .removeAddressbook('livenet')
                .then(() => {
                this.persistenceProvider.removeAddressbook('testnet').then(() => {
                    return resolve();
                });
            })
                .catch(() => {
                let msg = this.translate.instant('Error deleting addressbook');
                return reject(msg);
            })
                .catch(() => {
                let msg = this.translate.instant('Error deleting addressbook');
                return reject(msg);
            });
        });
    }
};
AddressBookProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [BwcProvider,
        Logger,
        PersistenceProvider,
        TranslateService])
], AddressBookProvider);
export { AddressBookProvider };
//# sourceMappingURL=address-book.js.map