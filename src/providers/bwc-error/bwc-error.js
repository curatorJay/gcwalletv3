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
let BwcErrorProvider = class BwcErrorProvider {
    constructor(translate) {
        this.translate = translate;
    }
    msg(err, prefix) {
        if (!err)
            return 'Unknown error';
        const name = err.name
            ? err.name === 'Error'
                ? err.message
                : err.name.replace(/^bwc.Error/g, '')
            : err;
        let body = '';
        prefix = prefix || '';
        if (name) {
            switch (name) {
                case 'INVALID_BACKUP':
                    body = this.translate.instant('Wallet Recovery Phrase is invalid');
                    break;
                case 'WALLET_DOES_NOT_EXIST':
                    body = this.translate.instant('Wallet not registered at the wallet service. Recreate it from "Create Wallet" using "Advanced Options" to set your recovery phrase');
                    break;
                case 'MISSING_PRIVATE_KEY':
                    body = this.translate.instant('Missing private keys to sign');
                    break;
                case 'ENCRYPTED_PRIVATE_KEY':
                    body = this.translate.instant('Private key is encrypted, cannot sign');
                    break;
                case 'SERVER_COMPROMISED':
                    body = this.translate.instant('Server response could not be verified');
                    break;
                case 'COULD_NOT_BUILD_TRANSACTION':
                    body = this.translate.instant('Could not build transaction');
                    break;
                case 'INSUFFICIENT_FUNDS':
                    body = this.translate.instant('Insufficient funds');
                    break;
                case 'CONNECTION_ERROR':
                    body = this.translate.instant('Network error');
                    break;
                case 'NOT_FOUND':
                    body = this.translate.instant('Wallet service not found');
                    break;
                case 'ECONNRESET_ERROR':
                    body = this.translate.instant('Connection reset by peer');
                    break;
                case 'BAD_RESPONSE_CODE':
                    body = this.translate.instant('The request could not be understood by the server');
                    break;
                case 'WALLET_ALREADY_EXISTS':
                    body = this.translate.instant('Wallet already exists');
                    break;
                case 'COPAYER_IN_WALLET':
                    body = this.translate.instant('Copayer already in this wallet');
                    break;
                case 'WALLET_FULL':
                    body = this.translate.instant('Wallet is full');
                    break;
                case 'WALLET_NOT_FOUND':
                    body = this.translate.instant('Wallet not found');
                    break;
                case 'INSUFFICIENT_FUNDS_FOR_FEE':
                    body = this.translate.instant('Insufficient funds for fee');
                    break;
                case 'LOCKED_FUNDS':
                    body = this.translate.instant('Funds are locked by pending spend proposals');
                    break;
                case 'COPAYER_VOTED':
                    body = this.translate.instant('Copayer already voted on this spend proposal');
                    break;
                case 'NOT_AUTHORIZED':
                    body = this.translate.instant('Not authorized');
                    break;
                case 'TX_ALREADY_BROADCASTED':
                    body = this.translate.instant('Transaction already broadcasted');
                    break;
                case 'TX_CANNOT_CREATE':
                    body = this.translate.instant('Locktime in effect. Please wait to create a new spend proposal');
                    break;
                case 'TX_CANNOT_REMOVE':
                    body = this.translate.instant('Locktime in effect. Please wait to remove this spend proposal');
                    break;
                case 'TX_NOT_ACCEPTED':
                    body = this.translate.instant('Spend proposal is not accepted');
                    break;
                case 'TX_NOT_FOUND':
                    body = this.translate.instant('Spend proposal not found');
                    break;
                case 'TX_NOT_PENDING':
                    body = this.translate.instant('The spend proposal is not pending');
                    break;
                case 'UPGRADE_NEEDED':
                    body = this.translate.instant('Please upgrade GetCoins to perform this action');
                    break;
                case 'BAD_SIGNATURES':
                    body = this.translate.instant('Signatures rejected by server');
                    break;
                case 'COPAYER_DATA_MISMATCH':
                    body = this.translate.instant('Copayer data mismatch');
                    break;
                case 'DUST_AMOUNT':
                    body = this.translate.instant('Amount below minimum allowed');
                    break;
                case 'INCORRECT_ADDRESS_NETWORK':
                    body = this.translate.instant('Incorrect network address');
                    break;
                case 'COPAYER_REGISTERED':
                    body = this.translate.instant('Key already associated with an existing wallet');
                    break;
                case 'INVALID_ADDRESS':
                    body = this.translate.instant('Invalid address');
                    break;
                case 'MAIN_ADDRESS_GAP_REACHED':
                    body = this.translate.instant('Empty addresses limit reached. New addresses cannot be generated.');
                    break;
                case 'WALLET_LOCKED':
                    body = this.translate.instant('Wallet is locked');
                    break;
                case 'WALLET_NOT_COMPLETE':
                    body = this.translate.instant('Wallet is not complete');
                    break;
                case 'WALLET_NEEDS_BACKUP':
                    body = this.translate.instant('Wallet needs backup');
                    break;
                case 'MISSING_PARAMETER':
                    body = this.translate.instant('Missing parameter');
                    break;
                case 'NO_PASSWORD_GIVEN':
                    body = this.translate.instant('Encrypt password needed');
                    break;
                case 'PASSWORD_INCORRECT':
                    body = this.translate.instant('Wrong encrypt password');
                    break;
                case 'EXCEEDED_DAILY_LIMIT':
                    body = this.translate.instant('Exceeded daily limit of $500 per user');
                    break;
                case 'ERROR':
                    body = err.message || err.error;
                    break;
                default:
                    body = err.message || name;
                    break;
            }
        }
        else if (err.message) {
            body = err.message;
        }
        else {
            body = err;
        }
        var msg = prefix + (body ? (prefix ? ': ' : '') + body : '');
        return msg;
    }
    cb(err, prefix) {
        return new Promise(resolve => {
            resolve(this.msg(err, prefix));
        });
    }
};
BwcErrorProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [TranslateService])
], BwcErrorProvider);
export { BwcErrorProvider };
//# sourceMappingURL=bwc-error.js.map