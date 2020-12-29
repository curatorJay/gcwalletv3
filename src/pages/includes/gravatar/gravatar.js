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
import { Md5 } from 'ts-md5/dist/md5';
import { Logger } from '../../../providers/logger/logger';
let GravatarPage = class GravatarPage {
    constructor(logger) {
        this.logger = logger;
    }
    ngOnInit() {
        this.logger.info('ionViewDidLoad GravatarPage');
        if (typeof this.email === 'string') {
            this.emailHash = Md5.hashStr(this.email.toLowerCase() || '');
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], GravatarPage.prototype, "email", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], GravatarPage.prototype, "name", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], GravatarPage.prototype, "height", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], GravatarPage.prototype, "width", void 0);
GravatarPage = __decorate([
    Component({
        selector: 'gravatar',
        templateUrl: 'gravatar.html'
    }),
    __metadata("design:paramtypes", [Logger])
], GravatarPage);
export { GravatarPage };
//# sourceMappingURL=gravatar.js.map