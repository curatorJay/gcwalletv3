var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
let PinPad = class PinPad {
    constructor() {
        this.keystrokeSubject = new Subject();
        this.keystroke = this.keystrokeSubject.asObservable();
        this.buttonRows = [
            [
                {
                    value: '1',
                    letters: ''
                },
                {
                    value: '2',
                    letters: 'ABC'
                },
                {
                    value: '3',
                    letters: 'DEF'
                }
            ],
            [
                {
                    value: '4',
                    letters: 'GHI'
                },
                {
                    value: '5',
                    letters: 'JKL'
                },
                {
                    value: '6',
                    letters: 'MNO'
                }
            ],
            [
                {
                    value: '7',
                    letters: 'PQRS'
                },
                {
                    value: '8',
                    letters: 'TUV'
                },
                {
                    value: '9',
                    letters: 'WXYZ'
                }
            ],
            [
                {
                    value: '',
                    letters: ''
                },
                {
                    value: '0',
                    letters: ''
                },
                {
                    value: 'delete',
                    letters: ''
                }
            ]
        ];
    }
    onKeystroke(value) {
        this.keystrokeSubject.next(value);
    }
};
__decorate([
    Output(),
    __metadata("design:type", Observable)
], PinPad.prototype, "keystroke", void 0);
PinPad = __decorate([
    Component({
        selector: 'pin-pad',
        template: `
    <ion-row *ngFor="let row of buttonRows">
      <ion-col *ngFor="let button of row" (click)="onKeystroke(button.value)" tappable>
        <div>
          <span *ngIf="button.value !== 'delete'">{{button.value}}</span>
          <img *ngIf="button.value === 'delete'" src="assets/img/tail-left.svg">
        </div>
        <div class="letters">{{button.letters}}</div>
      </ion-col>
    </ion-row>
  `
    })
], PinPad);
export { PinPad };
//# sourceMappingURL=pin-pad.component.js.map