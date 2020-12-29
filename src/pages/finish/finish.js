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
import { TranslateService } from '@ngx-translate/core';
import { NavParams, ViewController } from 'ionic-angular';
let FinishModalPage = class FinishModalPage {
    constructor(viewCtrl, navParams, translate) {
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.translate = translate;
        this.finishText =
            this.navParams.data.finishText || this.navParams.data.finishText == ''
                ? this.navParams.data.finishText
                : this.translate.instant('Payment Sent');
        this.finishComment = this.navParams.data.finishComment
            ? this.navParams.data.finishComment
            : '';
        this.cssClass = this.navParams.data.cssClass
            ? this.navParams.data.cssClass
            : 'success';
    }
    close() {
        this.viewCtrl.dismiss();
    }
};
FinishModalPage = __decorate([
    Component({
        selector: 'page-finish',
        templateUrl: 'finish.html'
    }),
    __metadata("design:paramtypes", [ViewController,
        NavParams,
        TranslateService])
], FinishModalPage);
export { FinishModalPage };
//# sourceMappingURL=finish.js.map