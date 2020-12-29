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
import { Logger } from '../../providers/logger/logger';
let NodeWebkitProvider = class NodeWebkitProvider {
    constructor(logger) {
        this.logger = logger;
        this.logger.info('NodeWebkitProvider initialized.');
    }
    readFromClipboard() {
        let gui = window.require('nw.gui');
        let clipboard = gui.Clipboard.get();
        return clipboard.get();
    }
    writeToClipboard(text) {
        let gui = window.require('nw.gui');
        let clipboard = gui.Clipboard.get();
        return clipboard.set(text);
    }
    openExternalLink(url) {
        let gui = window.require('nw.gui');
        return gui.Shell.openExternal(url);
    }
};
NodeWebkitProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Logger])
], NodeWebkitProvider);
export { NodeWebkitProvider };
//# sourceMappingURL=node-webkit.js.map