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
import { AlertController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { AddressBookProvider } from '../../../providers/address-book/address-book';
import { Logger } from '../../../providers/logger/logger';
import { AddressbookAddPage } from './add/add';
import { AddressbookViewPage } from './view/view';
let AddressbookPage = class AddressbookPage {
    constructor(navCtrl, navParams, alertCtrl, logger, addressbookProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.logger = logger;
        this.addressbookProvider = addressbookProvider;
        this.cache = false;
        this.addressbook = [];
        this.filteredAddressbook = [];
        this.initAddressbook();
    }
    ionViewDidEnter() {
        if (this.cache)
            this.initAddressbook();
        this.cache = true;
    }
    initAddressbook() {
        this.addressbookProvider
            .list()
            .then(addressBook => {
            this.isEmptyList = _.isEmpty(addressBook);
            let contacts = [];
            _.each(addressBook, (contact, k) => {
                contacts.push({
                    name: _.isObject(contact) ? contact.name : contact,
                    address: k,
                    email: _.isObject(contact) ? contact.email : null
                });
            });
            this.addressbook = _.clone(contacts);
            this.filteredAddressbook = _.clone(this.addressbook);
        })
            .catch(err => {
            this.logger.error(err);
            let alertError = this.alertCtrl.create({
                title: err,
                buttons: [
                    {
                        text: 'Go back',
                        handler: () => {
                            this.navCtrl.pop();
                        }
                    }
                ]
            });
            alertError.present();
        });
    }
    addEntry() {
        this.navCtrl.push(AddressbookAddPage);
    }
    viewEntry(contact) {
        this.navCtrl.push(AddressbookViewPage, { contact });
    }
    getItems(event) {
        // set val to the value of the searchbar
        let val = event.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            let result = _.filter(this.addressbook, item => {
                let name = item['name'];
                return _.includes(name.toLowerCase(), val.toLowerCase());
            });
            this.filteredAddressbook = result;
        }
        else {
            // Reset items back to all of the items
            this.initAddressbook();
        }
    }
};
AddressbookPage = __decorate([
    Component({
        selector: 'page-addressbook',
        templateUrl: 'addressbook.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        AlertController,
        Logger,
        AddressBookProvider])
], AddressbookPage);
export { AddressbookPage };
//# sourceMappingURL=addressbook.js.map