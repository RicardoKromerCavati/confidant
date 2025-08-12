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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbSession = void 0;
const libsql_1 = require("@mikro-orm/libsql");
let DbSession = class DbSession {
    constructor(passwordHash, expiration) {
        this.id = 1;
        this.passwordHash = passwordHash;
        this.expiration = expiration;
    }
};
exports.DbSession = DbSession;
__decorate([
    (0, libsql_1.PrimaryKey)({ primary: true, autoincrement: true, default: 1 }),
    __metadata("design:type", Number)
], DbSession.prototype, "id", void 0);
__decorate([
    (0, libsql_1.Property)(),
    __metadata("design:type", String)
], DbSession.prototype, "passwordHash", void 0);
__decorate([
    (0, libsql_1.Property)(),
    __metadata("design:type", String)
], DbSession.prototype, "expiration", void 0);
exports.DbSession = DbSession = __decorate([
    (0, libsql_1.Entity)(),
    __metadata("design:paramtypes", [String, String])
], DbSession);
