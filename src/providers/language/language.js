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
import { ConfigProvider } from '../config/config';
import * as _ from 'lodash';
import * as moment from 'moment';
let LanguageProvider = class LanguageProvider {
    constructor(logger, translate, configProvider) {
        this.logger = logger;
        this.translate = translate;
        this.configProvider = configProvider;
        this.languages = [
            {
                name: 'English',
                isoCode: 'en'
            },
            {
                name: 'Español',
                isoCode: 'es'
            },
            {
                name: 'Français',
                isoCode: 'fr'
            },
            {
                name: 'Italiano',
                isoCode: 'it'
            },
            {
                name: 'Nederlands',
                isoCode: 'nl'
            },
            {
                name: 'Polski',
                isoCode: 'pl'
            },
            {
                name: 'Deutsch',
                isoCode: 'de'
            },
            {
                name: '日本語',
                isoCode: 'ja',
                useIdeograms: true
            },
            {
                name: '中文（简体）',
                isoCode: 'zh',
                useIdeograms: true
            },
            {
                name: 'Pусский',
                isoCode: 'ru'
            },
            {
                name: 'Português',
                isoCode: 'pt'
            }
        ];
        this.logger.info('LanguageProvider initialized.');
        this.translate.onLangChange.subscribe(event => {
            this.logger.info('Setting new default language to: ' + event.lang);
        });
    }
    load() {
        let lang = this.configProvider.get().wallet.settings.defaultLanguage;
        if (!_.isEmpty(lang))
            this.current = lang;
        else {
            // Get from browser
            const browserLang = this.translate.getBrowserLang();
            this.current = this.getName(browserLang)
                ? browserLang
                : this.getDefault();
        }
        this.logger.info('Default language: ' + this.current);
        this.translate.setDefaultLang(this.current);
        moment.locale(this.current);
    }
    set(lang) {
        this.current = lang;
        this.translate.use(lang);
        moment.locale(lang);
        this.configProvider.set({
            wallet: { settings: { defaultLanguage: lang } }
        });
    }
    getName(lang) {
        return _.result(_.find(this.languages, {
            isoCode: lang
        }), 'name');
    }
    getDefault() {
        return this.languages[0]['isoCode'];
    }
    getCurrent() {
        return this.current;
    }
    getAvailables() {
        return this.languages;
    }
};
LanguageProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Logger,
        TranslateService,
        ConfigProvider])
], LanguageProvider);
export { LanguageProvider };
//# sourceMappingURL=language.js.map