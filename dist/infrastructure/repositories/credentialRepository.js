"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialRepository = void 0;
const credential_1 = require("../../domain/models/credential");
const dbCredential_1 = require("../models/dbCredential");
const tsyringe_1 = require("tsyringe");
const databaseContext_1 = require("../databaseContext");
const dbPassword_1 = require("../models/dbPassword");
let CredentialRepository = class CredentialRepository {
    constructor(databaseContext) {
        this._databaseContext = databaseContext;
    }
    async createCredential(credential) {
        const context = await this._databaseContext.getContext();
        const dbPassword = new dbPassword_1.DbPassword(credential.password.value);
        const dbCredential = new dbCredential_1.DbCredential(credential.credentialName, credential.username, dbPassword);
        await context.persist(dbCredential).flush();
    }
    async getCredentialNames() {
        const context = await this._databaseContext.getContext();
        const dbCredentials = (await context.findAll(dbCredential_1.DbCredential, {
            populate: ['password.value']
        }));
        const credentials = new Array(dbCredentials.length);
        for (let index = 0; index < dbCredentials.length; index++) {
            const username = dbCredentials[index].username;
            const password = dbCredentials[index].password;
            const credentialName = dbCredentials[index].credentialName;
            const id = dbCredentials[index].id;
            const [_, credential] = credential_1.Credential.Create(id, credentialName, username, password.value);
            credentials[index] = credential;
        }
        return credentials;
    }
    async getCredentialById(credentialId) {
        const context = await this._databaseContext.getContext();
        const dbCredential = await context.findOne(dbCredential_1.DbCredential, credentialId);
        if (dbCredential === null ||
            dbCredential === undefined) {
            return null;
        }
        const [_, credential] = credential_1.Credential.Create(dbCredential.id, dbCredential.credentialName, dbCredential.username, dbCredential.password.value);
        return credential;
    }
};
exports.CredentialRepository = CredentialRepository;
exports.CredentialRepository = CredentialRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(databaseContext_1.DatabaseContext)),
    __metadata("design:paramtypes", [databaseContext_1.DatabaseContext])
], CredentialRepository);
