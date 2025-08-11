"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
String.prototype.isNullOrWhiteSpace = function () {
    return this === null || this === undefined || this.trim() === '';
};
String.prototype.hasSpecialChars = function () {
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return specialCharsRegex.test(this.valueOf());
};
String.prototype.hasNumbers = function () {
    return /\d/.test(this.valueOf());
};
