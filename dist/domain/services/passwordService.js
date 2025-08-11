"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
require("../extensions/stringExtensions");
class PasswordService {
    static createPassword(characterAmount, useNumbers = true, useSpecialChars = true, useUpperCase = true) {
        const passwordOptions = {
            num: "1234567890",
            specialChar: "!@#$%&'()*+,^-./:;<=>?[]_`{~}|",
            lowerCase: "abcdefghijklmnopqrstuvwxyz",
            upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        };
        let passInfo = "";
        const passChars = [];
        passInfo += passwordOptions.lowerCase;
        passChars.push(PasswordService.getRandomChar(passwordOptions.lowerCase));
        if (useNumbers) {
            passInfo += passwordOptions.num;
            passChars.push(PasswordService.getRandomChar(passwordOptions.num));
        }
        if (useSpecialChars) {
            passInfo += passwordOptions.specialChar;
            passChars.push(PasswordService.getRandomChar(passwordOptions.specialChar));
        }
        if (useUpperCase) {
            passInfo += passwordOptions.upperCase;
            passChars.push(PasswordService.getRandomChar(passwordOptions.upperCase));
        }
        while (passChars.length < characterAmount) {
            passChars.push(PasswordService.getRandomChar(passInfo));
        }
        ;
        for (let i = passChars.length - 1; i > 0; i--) {
            const swapIndex = Math.floor(Math.random() * (i + 1));
            const temp = passChars[i];
            passChars[i] = passChars[swapIndex];
            passChars[swapIndex] = temp;
        }
        ;
        return passChars.join("");
    }
    static getRandomChar(fromString) {
        return fromString[Math.floor(Math.random() * fromString.length)];
    }
}
exports.PasswordService = PasswordService;
