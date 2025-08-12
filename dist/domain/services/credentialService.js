"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialService = void 0;
const credential_1 = require("../../domain/models/credential");
const credentialRepository_1 = require("../../infrastructure/repositories/credentialRepository");
require("../extensions/stringExtensions");
require("../services/passwordService");
const passwordService_1 = require("../services/passwordService");
const operationResultHandler = __importStar(require("../models/operationResult"));
const tsyringe_1 = require("tsyringe");
let CredentialService = class CredentialService {
    constructor(credentialRepository) {
        this._credentialRepository = credentialRepository;
    }
    async createCredential(credentialName, username, password) {
        try {
            if (password === undefined || password.isNullOrWhiteSpace()) {
                const defaultPasswordLength = 12;
                password = passwordService_1.PasswordService.createPassword(defaultPasswordLength);
            }
            const [result, credential] = credential_1.Credential.Create(0, credentialName, username, password);
            if (result && credential != null) {
                await this._credentialRepository.createCredential(credential);
                return operationResultHandler.createSuccessResult(true);
            }
            return operationResultHandler.createErrorResult('Credential not created');
        }
        catch (error) {
            return operationResultHandler.createErrorResult(JSON.stringify(error));
        }
    }
    async getCredentials() {
        try {
            const foundCredentials = await this._credentialRepository.getCredentialNames();
            if (foundCredentials.length <= 0) {
                return operationResultHandler.createErrorResult('There are no credentials available');
            }
            return operationResultHandler.createSuccessResult(foundCredentials);
        }
        catch (error) {
            console.log(error);
            return operationResultHandler.createErrorResult(JSON.stringify(error));
        }
    }
    async getCredentialPassword(id) {
        try {
            const foundCredential = await this._credentialRepository.getCredentialById(id);
            if (foundCredential == null) {
                return operationResultHandler.createErrorResult('Could not find credential');
            }
            return operationResultHandler.createSuccessResult(foundCredential.password.value);
        }
        catch (error) {
            return operationResultHandler.createErrorResult(JSON.stringify(error));
        }
    }
    static generatePassword(length, useNumbers, useSpecialChars, useUpperCaseChars) {
        try {
            return operationResultHandler.createSuccessResult(passwordService_1.PasswordService.createPassword(length, useNumbers, useSpecialChars, useUpperCaseChars));
        }
        catch (error) {
            return operationResultHandler.createErrorResult(JSON.stringify(error));
        }
    }
};
exports.CredentialService = CredentialService;
exports.CredentialService = CredentialService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(credentialRepository_1.CredentialRepository)),
    __metadata("design:paramtypes", [credentialRepository_1.CredentialRepository])
], CredentialService);
