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
import { PersistenceProvider } from '../persistence/persistence';
import * as _ from 'lodash';
const configDefault = {
    // wallet limits
    limits: {
        totalCopayers: 6,
        mPlusN: 100
    },
    // wallet default config
    wallet: {
        useLegacyAddress: false,
        requiredCopayers: 2,
        totalCopayers: 3,
        spendUnconfirmed: true,
        reconnectDelay: 5000,
        idleDurationMin: 4,
        settings: {
            unitName: 'BTC',
            unitToSatoshi: 100000000,
            unitDecimals: 8,
            unitCode: 'btc',
            alternativeName: 'US Dollar',
            alternativeIsoCode: 'USD',
            defaultLanguage: '',
            feeLevel: 'normal'
        }
    },
    // Bitcore wallet service URL
    bws: {
        url: 'https://bws.bitpay.com/bws/api'
    },
    download: {
        getcoins: {
            url: 'https://getcoins.com/#wallet'
        }
    },
    rateApp: {
        getcoins: {
            ios: 'https://itunes.apple.com/app/getcoins-wallet/id',
            android: 'https://play.google.com/store/apps/details?id=com.getcoins.wallet',
            wp: ''
        }
    },
    lock: {
        method: null,
        value: null,
        bannedUntil: null
    },
    // External services
    recentTransactions: {
        enabled: true
    },
    showIntegration: {
        coinbase: true,
        glidera: true,
        debitcard: true,
        amazon: true,
        mercadolibre: true,
        shapeshift: true
    },
    rates: {
        url: 'https://insight.bitpay.com:443/api/rates'
    },
    release: {
        url: 'https://api.github.com/repos/getcoins/wallet/releases/latest'
    },
    pushNotificationsEnabled: true,
    confirmedTxsNotifications: {
        enabled: true
    },
    emailNotifications: {
        enabled: false,
        email: ''
    },
    log: {
        weight: 3
    },
    blockExplorerUrl: {
        btc: 'insight.bitpay.com',
        bch: 'bch-insight.bitpay.com/#'
    }
};
let ConfigProvider = class ConfigProvider {
    constructor(logger, persistence) {
        this.logger = logger;
        this.persistence = persistence;
        this.logger.info('ConfigProvider initialized.');
    }
    load() {
        return new Promise((resolve, reject) => {
            this.persistence
                .getConfig()
                .then((config) => {
                if (!_.isEmpty(config)) {
                    this.configCache = _.clone(config);
                    this.backwardCompatibility();
                }
                else {
                    this.configCache = _.clone(configDefault);
                }
                resolve();
            })
                .catch(err => {
                this.logger.error('Error Loading Config');
                reject(err);
            });
        });
    }
    /**
     * @param newOpts object or string (JSON)
     */
    set(newOpts) {
        let config = _.cloneDeep(configDefault);
        if (_.isString(newOpts)) {
            newOpts = JSON.parse(newOpts);
        }
        _.merge(config, this.configCache, newOpts);
        this.configCache = config;
        this.persistence.storeConfig(this.configCache).then(() => {
            this.logger.info('Config saved');
        });
    }
    get() {
        return this.configCache;
    }
    getDefaults() {
        return configDefault;
    }
    backwardCompatibility() {
        // these ifs are to avoid migration problems
        if (this.configCache.bws) {
            this.configCache.bws = configDefault.bws;
        }
        if (!this.configCache.wallet) {
            this.configCache.wallet = configDefault.wallet;
        }
        if (!this.configCache.wallet.settings.unitCode) {
            this.configCache.wallet.settings.unitCode =
                configDefault.wallet.settings.unitCode;
        }
        if (!this.configCache.showIntegration) {
            this.configCache.showIntegration = configDefault.showIntegration;
        }
        if (!this.configCache.recentTransactions) {
            this.configCache.recentTransactions = configDefault.recentTransactions;
        }
        if (!this.configCache.pushNotificationsEnabled) {
            this.configCache.pushNotificationsEnabled =
                configDefault.pushNotificationsEnabled;
        }
        if (this.configCache.wallet.settings.unitCode == 'bit') {
            // Convert to BTC. Bits will be disabled
            this.configCache.wallet.settings.unitName =
                configDefault.wallet.settings.unitName;
            this.configCache.wallet.settings.unitToSatoshi =
                configDefault.wallet.settings.unitToSatoshi;
            this.configCache.wallet.settings.unitDecimals =
                configDefault.wallet.settings.unitDecimals;
            this.configCache.wallet.settings.unitCode =
                configDefault.wallet.settings.unitCode;
        }
    }
};
ConfigProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Logger,
        PersistenceProvider])
], ConfigProvider);
export { ConfigProvider };
//# sourceMappingURL=config.js.map