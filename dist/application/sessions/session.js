"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
class Session {
    constructor(masterPassword, expirationDate) {
        this.expirationDate = '';
        this.masterPassword = '';
        this.masterPassword = masterPassword;
        this.expirationDate = expirationDate;
    }
}
exports.Session = Session;
