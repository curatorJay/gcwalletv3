var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Animate } from './../../../directives/animate/animate';
let PinDots = class PinDots {
    constructor() {
        this.dotArray = new Array(4);
    }
    ngOnChanges(changes) {
        const pinChanges = changes.pin;
        if (!pinChanges) {
            return;
        }
        const currentValue = pinChanges.currentValue;
        const previousValue = pinChanges.previousValue;
        if (!currentValue.length || currentValue.length < previousValue.length) {
            return;
        }
        this.pulseDot(currentValue.length - 1);
    }
    isFilled(limit) {
        return this.pin && this.pin.length >= limit;
    }
    pulseDot(dotIndex) {
        const dot = this.dots.toArray()[dotIndex];
        dot.animate('pulse');
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], PinDots.prototype, "pin", void 0);
__decorate([
    ViewChildren(Animate),
    __metadata("design:type", QueryList)
], PinDots.prototype, "dots", void 0);
PinDots = __decorate([
    Component({
        selector: 'pin-dots',
        template: `
    <div *ngFor="let dot of dotArray; index as i" class="circle" [ngClass]="{filled: isFilled(i+1)}" animate></div>
  `
    })
], PinDots);
export { PinDots };
//# sourceMappingURL=pin-dots.component.js.map