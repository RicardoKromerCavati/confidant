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
exports.SessionRepository = void 0;
const dbSession_1 = require("../models/dbSession");
const databaseContext_1 = require("../databaseContext");
const tsyringe_1 = require("tsyringe");
let SessionRepository = class SessionRepository {
    constructor(databaseContext) {
        this._databaseContext = databaseContext;
    }
    async InsertSession(session) {
        const context = await this._databaseContext.getContext();
        const dbSession = new dbSession_1.DbSession(session.masterPassword, session.expirationDate);
        await context.persist(dbSession).flush();
    }
    async UpdateSession(dbSession) {
        const context = await this._databaseContext.getContext();
        context.nativeUpdate(dbSession_1.DbSession, { id: 1 }, { expiration: dbSession.expiration });
        context.flush();
        const user = await context.findOne(dbSession_1.DbSession, { id: 1 });
    }
    async GetSession() {
        const context = await this._databaseContext.getContext();
        return await context.findOne(dbSession_1.DbSession, 1);
    }
};
exports.SessionRepository = SessionRepository;
exports.SessionRepository = SessionRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(databaseContext_1.DatabaseContext)),
    __metadata("design:paramtypes", [databaseContext_1.DatabaseContext])
], SessionRepository);
