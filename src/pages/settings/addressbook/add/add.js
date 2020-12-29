var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, Events, NavController, NavParams } from 'ionic-angular';
// providers
import { AddressBookProvider } from '../../../../providers/address-book/address-book';
import { BwcProvider } from '../../../../providers/bwc/bwc';
import { Logger } from '../../../../providers/logger/logger';
// validators
import { AddressValidator } from '../../../../validators/address';
import { ScanPage } from '../../../scan/scan';
let AddressbookAddPage = class AddressbookAddPage {
    constructor(navCtrl, navParams, events, alertCtrl, bwc, ab, formBuilder, logger) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.bwc = bwc;
        this.ab = ab;
        this.formBuilder = formBuilder;
        this.logger = logger;
        this.submitAttempt = false;
        this.addressBookAdd = this.formBuilder.group({
            name: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('[a-zA-Z0-9 ]*')
                ])
            ],
            email: ['', this.emailOrEmpty],
            address: [
                '',
                Validators.compose([
                    Validators.required,
                    new AddressValidator(this.bwc).isValid
                ])
            ]
        });
        if (this.navParams.data.addressbookEntry) {
            this.addressBookAdd.controls['address'].setValue(this.navParams.data.addressbookEntry);
        }
        this.events.subscribe('update:address', data => {
            let address = data.value.replace(/^bitcoin(cash)?:/, '');
            this.addressBookAdd.controls['address'].setValue(address);
        });
    }
    ionViewDidLoad() {
        this.logger.info('ionViewDidLoad AddressbookAddPage');
    }
    emailOrEmpty(control) {
        return control.value === '' ? null : Validators.email(control);
    }
    save() {
        this.submitAttempt = true;
        if (this.addressBookAdd.valid) {
            this.ab
                .add(this.addressBookAdd.value)
                .then(() => {
                this.navCtrl.pop();
                this.submitAttempt = false;
            })
                .catch(err => {
                let opts = {
                    title: err,
                    buttons: [
                        {
                            text: 'OK',
                            handler: () => {
                                this.navCtrl.pop();
                            }
                        }
                    ]
                };
                this.alertCtrl.create(opts).present();
                this.submitAttempt = false;
            });
        }
        else {
            let opts = {
                title: 'Error',
                message: 'Could not save the contact',
                buttons: [
                    {
                        text: 'OK',
                        handler: () => {
                            this.navCtrl.pop();
                        }
                    }
                ]
            };
            this.alertCtrl.create(opts).present();
            this.submitAttempt = false;
        }
    }
    openScanner() {
        this.navCtrl.push(ScanPage, { fromAddressbook: true });
    }
};
AddressbookAddPage = __decorate([
    Component({
        selector: 'page-addressbook-add',
        templateUrl: 'add.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Events,
        AlertController,
        BwcProvider,
        AddressBookProvider,
        FormBuilder,
        Logger])
], AddressbookAddPage);
export { AddressbookAddPage };
//# sourceMappingURL=add.js.map