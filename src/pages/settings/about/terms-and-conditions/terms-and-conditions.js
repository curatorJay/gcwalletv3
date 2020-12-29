var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Injectable } from '@angular/core';
import * as toudoc from '../../../../assets/terms-and-conditions.json';
// providers
import { Logger } from '../../../../providers/logger/logger';
// import * as _ from 'lodash';
let TermsAndConditionsPage = class TermsAndConditionsPage {
    // constructor(private toudata: TermsOfUseDataProvider, private logger: Logger, private translate: TranslateService
    constructor(logger) {
        this.logger = logger;
        this.touTitle = toudoc['title'];
        this.touUpdate = toudoc['update'];
        this.touComFull = toudoc['company_full'];
        this.touCom = toudoc['company'];
        this.touBwsFull = toudoc['bws_full'];
        this.touBws = toudoc['bws'];
        this.touSubComFull = toudoc['subcompany_full'];
        this.touSubCom = toudoc['subcompany'];
        this.touPartiesStm = toudoc['parties_stm'];
        this.touRightsObligation = toudoc['rights_obligation'];
        this.touDisclaimer = toudoc['disclaimer'];
        this.touChoiceOfLaw = toudoc['choice_of_low'];
        this.touSeverability = toudoc['severability'];
        this.touBindingArg = toudoc['binding_agreement'];
        this.touState = toudoc['state'];
        this.logger.info('ionViewDIdLoad TermsAndConditionsPage.');
        // console.log(toudoc);
        // console.log(this.touTitle);
    }
};
TermsAndConditionsPage = __decorate([
    Component({
        selector: 'page-terms-and-conditions',
        templateUrl: 'terms-and-conditions.html'
    }),
    Injectable(),
    __metadata("design:paramtypes", [Logger])
], TermsAndConditionsPage);
export { TermsAndConditionsPage };
//# sourceMappingURL=terms-and-conditions.js.map