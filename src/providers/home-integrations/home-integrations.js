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
import { Logger } from '../../providers/logger/logger';
import * as _ from 'lodash';
const exchangeList = [{ name: 'coinbase' }, { name: 'glidera' }];
let HomeIntegrationsProvider = class HomeIntegrationsProvider {
    constructor(http, logger) {
        this.http = http;
        this.logger = logger;
        this.logger.info('HomeIntegrationsProviders initialized.');
        this.services = [];
    }
    register(serviceInfo) {
        // Check if already exists
        if (_.find(this.services, { name: serviceInfo.name }))
            return;
        this.logger.info('Adding home Integrations entry:' + serviceInfo.name);
        this.services.push(serviceInfo);
    }
    unregister(serviceName) {
        this.services = _.filter(this.services, x => {
            return x.name != serviceName;
        });
    }
    updateLink(serviceName, token) {
        this.services = _.filter(this.services, x => {
            if (x.name == serviceName)
                x.linked = !!token;
            return x;
        });
    }
    updateConfig(serviceName, show) {
        this.services = _.filter(this.services, x => {
            if (x.name == serviceName)
                x.show = !!show;
            return x;
        });
    }
    get() {
        return _.orderBy(this.services, ['name'], ['asc']);
    }
    getAvailableExchange() {
        let exchangeServices = _.intersectionBy(this.services, exchangeList, 'name');
        return _.filter(exchangeServices, { linked: true, show: true });
    }
};
HomeIntegrationsProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient, Logger])
], HomeIntegrationsProvider);
export { HomeIntegrationsProvider };
//# sourceMappingURL=home-integrations.js.map