var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/* tslint:disable:no-console */
import { Injectable, isDevMode } from '@angular/core';
import * as _ from 'lodash';
let Logger = class Logger {
    constructor() {
        this.logs = [];
        this.levels = [
            { level: 'error', weight: 1, label: 'Error' },
            { level: 'warn', weight: 2, label: 'Warning' },
            { level: 'info', weight: 3, label: 'Info', default: true },
            { level: 'debug', weight: 4, label: 'Debug' }
        ];
        // Create an array of level weights for performant filtering.
        this.weight = {};
        for (let i = 0; i < this.levels.length; i++) {
            this.weight[this.levels[i].level] = this.levels[i].weight;
        }
    }
    error(message, ...optionalParams) {
        let msg = '[error] ' + (_.isString(message) ? message : JSON.stringify(message));
        console.log(msg, ...optionalParams);
        let args = this.processingArgs(arguments);
        this.add('error', args);
    }
    debug(message, ...optionalParams) {
        let msg = '[debug] ' + (_.isString(message) ? message : JSON.stringify(message));
        if (isDevMode())
            console.log(msg, ...optionalParams);
        let args = this.processingArgs(arguments);
        this.add('debug', args);
    }
    info(message, ...optionalParams) {
        let msg = '[info] ' + (_.isString(message) ? message : JSON.stringify(message));
        if (isDevMode())
            console.log(msg, ...optionalParams);
        let args = this.processingArgs(arguments);
        this.add('info', args);
    }
    warn(message, ...optionalParams) {
        let msg = '[warn] ' + (_.isString(message) ? message : JSON.stringify(message));
        if (isDevMode())
            console.log(msg, ...optionalParams);
        let args = this.processingArgs(arguments);
        this.add('warn', args);
    }
    getLevels() {
        return this.levels;
    }
    getWeight(weight) {
        return _.find(this.levels, l => {
            return l.weight == weight;
        });
    }
    getDefaultWeight() {
        return _.find(this.levels, l => {
            return l.default;
        });
    }
    add(level, msg) {
        msg = msg.replace('/xpriv.*/', '[...]');
        msg = msg.replace('/walletPrivKey.*/', 'walletPrivKey:[...]');
        this.logs.push({
            timestamp: new Date().toISOString(),
            level,
            msg
        });
    }
    /**
     * Returns logs of <= to filteredWeight
     * @param {number} filteredWeight Weight (1-4) to use when filtering logs. optional
     */
    get(filterWeight) {
        let filteredLogs = this.logs;
        if (filterWeight != undefined) {
            filteredLogs = _.filter(this.logs, l => {
                return this.weight[l.level] <= filterWeight;
            });
        }
        return filteredLogs;
    }
    processingArgs(argsValues) {
        var args = Array.prototype.slice.call(argsValues);
        args = args.map(v => {
            try {
                if (typeof v == 'undefined')
                    v = 'undefined';
                if (!v)
                    v = 'null';
                if (typeof v == 'object') {
                    v = v.message ? v.message : JSON.stringify(v);
                }
            }
            catch (e) {
                console.log('Error at log decorator:', e);
                v = 'undefined';
            }
            return v;
        });
        return args.join(' ');
    }
};
Logger = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], Logger);
export { Logger };
//# sourceMappingURL=logger.js.map