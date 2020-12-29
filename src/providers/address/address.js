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
// Providers
import { BwcProvider } from '../../providers/bwc/bwc';
let AddressProvider = class AddressProvider {
    constructor(bwcProvider) {
        this.bwcProvider = bwcProvider;
        this.bitcore = this.bwcProvider.getBitcore();
        this.bitcoreCash = this.bwcProvider.getBitcoreCash();
        this.Bitcore = {
            btc: {
                lib: this.bitcore,
                translateTo: 'bch'
            },
            bch: {
                lib: this.bitcoreCash,
                translateTo: 'btc'
            }
        };
    }
    getCoin(address) {
        try {
            new this.Bitcore['btc'].lib.Address(address);
            return 'btc';
        }
        catch (e) {
            try {
                new this.Bitcore['bch'].lib.Address(address);
                return 'bch';
            }
            catch (e) {
                return null;
            }
        }
    }
    translateAddress(address) {
        var origCoin = this.getCoin(address);
        if (!origCoin)
            return undefined;
        var origAddress = new this.Bitcore[origCoin].lib.Address(address);
        var origObj = origAddress.toObject();
        var resultCoin = this.Bitcore[origCoin].translateTo;
        var resultAddress = this.Bitcore[resultCoin].lib.Address.fromObject(origObj);
        return {
            origCoin,
            origAddress: address,
            resultCoin,
            resultAddress: resultAddress.toString()
        };
    }
    validateAddress(address) {
        let Address = this.bitcore.Address;
        let AddressCash = this.bitcoreCash.Address;
        let isLivenet = Address.isValid(address, 'livenet');
        let isTestnet = Address.isValid(address, 'testnet');
        let isLivenetCash = AddressCash.isValid(address, 'livenet');
        let isTestnetCash = AddressCash.isValid(address, 'testnet');
        return {
            address,
            isValid: isLivenet || isTestnet || isLivenetCash || isTestnetCash,
            network: isTestnet || isTestnetCash ? 'testnet' : 'livenet',
            coin: this.getCoin(address),
            translation: this.translateAddress(address)
        };
    }
};
AddressProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [BwcProvider])
], AddressProvider);
export { AddressProvider };
//# sourceMappingURL=address.js.map