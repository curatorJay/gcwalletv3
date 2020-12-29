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
// Providers
import { AppProvider } from '../../providers/app/app';
import { BwcProvider } from '../../providers/bwc/bwc';
import { ProfileProvider } from '../../providers/profile/profile';
let BackupProvider = class BackupProvider {
    constructor(appProvider, bwcProvider, logger, profileProvider) {
        this.appProvider = appProvider;
        this.bwcProvider = bwcProvider;
        this.logger = logger;
        this.profileProvider = profileProvider;
        this.logger.info('BackupProvider initialized.');
    }
    walletDownload(password, opts, walletId) {
        return new Promise((resolve, reject) => {
            let wallet = this.profileProvider.getWallet(walletId);
            let ew = this.walletExport(password, opts, walletId);
            if (!ew)
                return reject('Could not create backup');
            let walletName = (wallet.alias || '') +
                (wallet.alias ? '-' : '') +
                wallet.credentials.walletName;
            if (opts.noSign)
                walletName = walletName + '-noSign';
            let filename = walletName + '-' + this.appProvider.info.nameCase + 'backup.aes.json';
            this._download(ew, filename).then(() => {
                return resolve();
            });
        });
    }
    walletExport(password, opts, walletId) {
        if (!password) {
            return null;
        }
        let wallet = this.profileProvider.getWallet(walletId);
        try {
            opts = opts ? opts : {};
            let b = wallet.export(opts);
            if (opts.addressBook)
                b = this.addMetadata(b, opts);
            let e = this.bwcProvider.getSJCL().encrypt(password, b, {
                iter: 10000
            });
            return e;
        }
        catch (err) {
            this.logger.debug('Error exporting wallet: ', err);
            return null;
        }
    }
    addMetadata(b, opts) {
        b = JSON.parse(b);
        if (opts.addressBook)
            b.addressBook = opts.addressBook;
        return JSON.stringify(b);
    }
    _download(ew, fileName) {
        return new Promise(resolve => {
            let a = document.createElement('a');
            let blob = this.NewBlob(ew, 'text/plain;charset=utf-8');
            let url = window.URL.createObjectURL(blob);
            document.body.appendChild(a);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            return resolve();
        });
    }
    NewBlob(data, datatype) {
        let out;
        try {
            out = new Blob([data], {
                type: datatype
            });
            this.logger.debug('case 1');
        }
        catch (e) {
            if (e.name == 'InvalidStateError') {
                // InvalidStateError (tested on FF13 WinXP)
                out = new Blob([data], {
                    type: datatype
                });
                this.logger.debug('case 2');
            }
            else {
                // We're screwed, blob constructor unsupported entirely
                this.logger.debug('Error');
            }
        }
        return out;
    }
};
BackupProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AppProvider,
        BwcProvider,
        Logger,
        ProfileProvider])
], BackupProvider);
export { BackupProvider };
//# sourceMappingURL=backup.js.map