var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Logger } from '../../providers/logger/logger';
// providers
import { ConfigProvider } from '../../providers/config/config';
import { LanguageProvider } from '../../providers/language/language';
import { PersistenceProvider } from '../../providers/persistence/persistence';
import { PlatformProvider } from '../../providers/platform/platform';
/* TODO: implement interface properly
interface App {
  packageName: string;
  packageDescription: string;
  packageNameId: string;
  themeColor: string;
  userVisibleName: string;
  purposeLine: string;
  bundleName: string;
  appUri: string;
  name: string;
  nameNoSpace: string;
  nameCase: string;
  nameCaseNoSpace: string;
  gitHubRepoName: string;
  gitHubRepoUrl: string;
  gitHubRepoBugs: string;
  disclaimerUrl: string;
  url: string;
  appDescription: string;
  winAppName: string;
  WindowsStoreIdentityName: string;
  WindowsStoreDisplayName: string;
  windowsAppId: string;
  pushSenderId: string;
  description: string;
  version: string;
  androidVersion: string;
  commitHash: string;
  _extraCSS: string;
  _enabledExtensions;
}*/
let AppProvider = class AppProvider {
    constructor(http, logger, language, config, persistence, platformProvider) {
        this.http = http;
        this.logger = logger;
        this.language = language;
        this.config = config;
        this.persistence = persistence;
        this.platformProvider = platformProvider;
        this.info = {};
        this.jsonPathApp = 'assets/appConfig.json';
        this.jsonPathServices = 'assets/externalServices.json';
        this.logger.info('AppProvider initialized.');
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([this.getInfo(), this.loadProviders()]);
            this.setCustomMenuBarNW();
        });
    }
    getInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            [this.servicesInfo, this.info] = yield Promise.all([
                this.getServicesInfo(),
                this.getAppInfo()
            ]);
        });
    }
    loadProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            this.persistence.load();
            yield this.config.load();
            this.language.load();
        });
    }
    getAppInfo() {
        return this.http.get(this.jsonPathApp).toPromise();
    }
    getServicesInfo() {
        return this.http.get(this.jsonPathServices).toPromise();
    }
    setCustomMenuBarNW() {
        if (!this.platformProvider.isNW) {
            return;
        }
        let gui = window.require('nw.gui');
        let win = gui.Window.get();
        let nativeMenuBar = new gui.Menu({
            type: 'menubar'
        });
        try {
            nativeMenuBar.createMacBuiltin(this.info.nameCase);
        }
        catch (e) {
            this.logger.debug('This is not OSX');
        }
        win.menu = nativeMenuBar;
    }
};
AppProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient,
        Logger,
        LanguageProvider,
        ConfigProvider,
        PersistenceProvider,
        PlatformProvider])
], AppProvider);
export { AppProvider };
//# sourceMappingURL=app.js.map