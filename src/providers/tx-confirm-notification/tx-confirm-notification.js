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
import { Logger } from '../../providers/logger/logger';
// providers
import { PersistenceProvider } from '../persistence/persistence';
let TxConfirmNotificationProvider = class TxConfirmNotificationProvider {
    constructor(logger, persistenceProvider) {
        this.logger = logger;
        this.persistenceProvider = persistenceProvider;
        this.logger.info('TxConfirmNotificationProvider initialized.');
    }
    checkIfEnabled(txid) {
        return new Promise((resolve, reject) => {
            this.persistenceProvider
                .getTxConfirmNotification(txid)
                .then(res => {
                return resolve(!!res);
            })
                .catch(err => {
                this.logger.error(err);
                return reject(err);
            });
        });
    }
    subscribe(client, opts) {
        client.txConfirmationSubscribe(opts, err => {
            if (err)
                this.logger.error(err);
            this.persistenceProvider
                .setTxConfirmNotification(opts.txid, true)
                .catch(err => {
                this.logger.error(err);
                return;
            });
        });
    }
    unsubscribe(client, txId) {
        client.txConfirmationUnsubscribe(txId, err => {
            if (err)
                this.logger.error(err);
            this.persistenceProvider.removeTxConfirmNotification(txId).catch(err => {
                this.logger.error(err);
                return;
            });
        });
    }
};
TxConfirmNotificationProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Logger,
        PersistenceProvider])
], TxConfirmNotificationProvider);
export { TxConfirmNotificationProvider };
//# sourceMappingURL=tx-confirm-notification.js.map