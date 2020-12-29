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
import { AlertController, ModalController } from 'ionic-angular';
import { MiniModalComponent } from '../../components/mini-modal/mini-modal';
import { Logger } from '../../providers/logger/logger';
let PopupProvider = class PopupProvider {
    constructor(alertCtrl, logger, modalCtrl, translate) {
        this.alertCtrl = alertCtrl;
        this.logger = logger;
        this.modalCtrl = modalCtrl;
        this.translate = translate;
    }
    ionicAlert(title, subTitle, okText) {
        return new Promise(resolve => {
            let alert = this.alertCtrl.create({
                title,
                subTitle,
                enableBackdropDismiss: false,
                buttons: [
                    {
                        text: okText ? okText : this.translate.instant('Ok'),
                        handler: () => {
                            this.logger.info('Ok clicked');
                            resolve();
                        }
                    }
                ]
            });
            alert.present();
        });
    }
    ionicConfirm(title, message, okText, cancelText) {
        return new Promise(resolve => {
            let confirm = this.alertCtrl.create({
                title,
                message,
                buttons: [
                    {
                        text: cancelText ? cancelText : this.translate.instant('Cancel'),
                        handler: () => {
                            this.logger.info('Disagree clicked');
                            resolve(false);
                        }
                    },
                    {
                        text: okText ? okText : this.translate.instant('Ok'),
                        handler: () => {
                            this.logger.info('Agree clicked');
                            resolve(true);
                        }
                    }
                ],
                enableBackdropDismiss: false
            });
            confirm.present();
        });
    }
    ionicPrompt(title, message, opts, okText, cancelText) {
        return new Promise(resolve => {
            let defaultText = opts && opts.defaultText ? opts.defaultText : null;
            let placeholder = opts && opts.placeholder ? opts.placeholder : null;
            let inputType = opts && opts.type ? opts.type : 'text';
            let cssClass = opts && opts.useDanger ? 'alertDanger' : null;
            let enableBackdropDismiss = !!(opts && opts.enableBackdropDismiss);
            let prompt = this.alertCtrl.create({
                title,
                message,
                cssClass,
                enableBackdropDismiss,
                inputs: [
                    {
                        value: defaultText,
                        placeholder,
                        type: inputType
                    }
                ],
                buttons: [
                    {
                        text: cancelText ? cancelText : this.translate.instant('Cancel'),
                        handler: () => {
                            this.logger.info('Cancel clicked');
                            resolve(null);
                        }
                    },
                    {
                        text: okText ? okText : this.translate.instant('Ok'),
                        handler: data => {
                            this.logger.info('Saved clicked');
                            resolve(data[0]);
                        }
                    }
                ]
            });
            prompt.present();
        });
    }
    createMiniModal(modalTitle) {
        return this.modalCtrl.create(MiniModalComponent, { modalTitle }, { cssClass: 'fullscreen-modal' });
    }
};
PopupProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AlertController,
        Logger,
        ModalController,
        TranslateService])
], PopupProvider);
export { PopupProvider };
//# sourceMappingURL=popup.js.map