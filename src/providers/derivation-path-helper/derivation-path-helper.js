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
let DerivationPathHelperProvider = class DerivationPathHelperProvider {
    constructor() {
        this.default = "m/44'/0'/0'";
        this.defaultTestnet = "m/44'/1'/0'";
    }
    parse(str) {
        var arr = str.split('/');
        var ret = {
            derivationStrategy: '',
            networkName: '',
            account: 0
        };
        if (arr[0] != 'm')
            return false;
        switch (arr[1]) {
            case "44'":
                ret.derivationStrategy = 'BIP44';
                break;
            case "45'":
                return {
                    derivationStrategy: 'BIP45',
                    networkName: 'livenet',
                    account: 0
                };
            case "48'":
                ret.derivationStrategy = 'BIP48';
                break;
            default:
                return false;
        }
        switch (arr[2]) {
            case "0'":
                ret.networkName = 'livenet';
                break;
            case "1'":
                ret.networkName = 'testnet';
                break;
            default:
                return false;
        }
        var match = arr[3].match(/(\d+)'/);
        if (!match)
            return false;
        ret.account = +match[1];
        return ret;
    }
};
DerivationPathHelperProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], DerivationPathHelperProvider);
export { DerivationPathHelperProvider };
//# sourceMappingURL=derivation-path-helper.js.map