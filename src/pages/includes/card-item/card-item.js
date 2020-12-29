var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { TimeProvider } from '../../../providers/time/time';
let CardItemPage = class CardItemPage {
    constructor(timeProvider) {
        this.timeProvider = timeProvider;
        this.sent = false;
        this.received = false;
        this.pending = false;
    }
    set card(card) {
        this._card = card;
        if (card.pending) {
            this.pending = true;
        }
        else if (card.price.toString().indexOf('-') > -1) {
            this.sent = true;
        }
        else {
            this.received = true;
        }
    }
    get card() {
        return this._card;
    }
    set currencySymbol(cs) {
        this._currencySymbol = cs;
    }
    get currencySymbol() {
        return this._currencySymbol;
    }
    createdWithinPastDay(time) {
        return this.timeProvider.withinPastDay(time);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], CardItemPage.prototype, "card", null);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], CardItemPage.prototype, "currencySymbol", null);
CardItemPage = __decorate([
    Component({
        selector: 'page-card-item',
        templateUrl: 'card-item.html'
    }),
    __metadata("design:paramtypes", [TimeProvider])
], CardItemPage);
export { CardItemPage };
//# sourceMappingURL=card-item.js.map