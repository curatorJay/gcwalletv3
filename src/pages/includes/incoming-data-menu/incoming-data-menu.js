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
import { Events, Platform } from 'ionic-angular';
let IncomingDataMenuPage = class IncomingDataMenuPage {
    constructor(events, platform) {
        this.events = events;
        this.platform = platform;
        this.https = false;
        this.showIncomingDataMenu = false;
        this.showSlideEffect = false;
        this.events.subscribe('showIncomingDataMenuEvent', data => {
            this.showIncomingDataMenu = true;
            this.data = data.data;
            this.type = data.type;
            this.coin = data.coin;
            if (this.type === 'url') {
                this.https = this.data.indexOf('https://') === 0 ? true : false;
            }
            setTimeout(() => {
                this.showSlideEffect = true;
            }, 50);
            let unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
                unregisterBackButtonAction();
                this.backdropDismiss();
            }, 0);
        });
    }
    backdropDismiss() {
        this.close(null, null);
    }
    close(redirTo, value) {
        if (redirTo == 'AmountPage') {
            let coin = this.coin ? this.coin : 'btc';
            this.events.publish('finishIncomingDataMenuEvent', {
                redirTo,
                value,
                coin
            });
        }
        else {
            this.events.publish('finishIncomingDataMenuEvent', { redirTo, value });
        }
        if (redirTo != 'OpenExternalLink') {
            this.showSlideEffect = false;
            setTimeout(() => {
                this.showIncomingDataMenu = false;
            }, 150);
        }
    }
};
IncomingDataMenuPage = __decorate([
    Component({
        selector: 'incoming-data-menu',
        templateUrl: 'incoming-data-menu.html'
    }),
    __metadata("design:paramtypes", [Events, Platform])
], IncomingDataMenuPage);
export { IncomingDataMenuPage };
//# sourceMappingURL=incoming-data-menu.js.map