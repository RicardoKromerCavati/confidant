"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Credential = void 0;
require("../extensions/stringExtensions");
require("../models/password");
const password_1 = require("../models/password");
class Credential {
    constructor(id, credentialName, username, password) {
        this.id = 0;
        this.credentialName = '';
        this.username = '';
        this.credentialName = credentialName;
        this.username = username;
        this.password = password;
        this.id = id;
    }
    static Create(id, credentialName, username, password) {
        var [result, message] = Credential.validateCredentialName(credentialName);
        if (result == false) {
            console.log(message);
            return [false, null];
        }
        [result, message] = Credential.validateUsername(username);
        if (result == false) {
            console.log(message);
            return [false, null];
        }
        const passwordResult = password_1.Password.CreatePassword(password);
        if (!passwordResult.isSuccessful) {
            console.log(passwordResult.message);
            return [false, null];
        }
        return [true, new Credential(id, credentialName, username, passwordResult.value)];
    }
    static validateCredentialName(credentialName) {
        if (credentialName.isNullOrWhiteSpace()) {
            return [false, 'Credential name must not be empty'];
        }
        return [true, ''];
    }
    static validateUsername(username) {
        if (username.isNullOrWhiteSpace()) {
            return [false, 'Username must not be empty'];
        }
        return [true, ''];
    }
}
exports.Credential = Credential;
