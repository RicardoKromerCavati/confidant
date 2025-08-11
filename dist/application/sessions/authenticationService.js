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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const password_1 = require("../../domain/models/password");
const session_1 = require("./session");
const sessionRepository_1 = require("../../infrastructure/repositories/sessionRepository");
const tsyringe_1 = require("tsyringe");
let AuthenticationService = class AuthenticationService {
    constructor(sessionRepository) {
        this._sessionRepository = sessionRepository;
    }
    async validateSession() {
        const dbSession = await this._sessionRepository.GetSession();
        if (dbSession === null) {
            const masterPassword = await this.createMasterPassword();
            var session = new session_1.Session(masterPassword, (0, moment_1.default)().add(10, 'minutes').toISOString(true));
            await this._sessionRepository.InsertSession(session);
            return true;
        }
        return await this.validateSessionInformation(dbSession);
    }
    async validateSessionInformation(dbSession) {
        if (!(0, moment_1.default)().isAfter(dbSession.expiration)) {
            return true;
        }
        console.log('Session expired');
        const prompt = (0, prompt_sync_1.default)({ sigint: true });
        const masterPassword = prompt('Please re enter your password: ', { echo: '*' });
        if (await bcrypt_1.default.compare(masterPassword, dbSession.passwordHash)) {
            dbSession.expiration = (0, moment_1.default)().add(10, 'minutes').toISOString(true);
            await this._sessionRepository.UpdateSession(dbSession);
            return true;
        }
        console.log('Invalid master password');
        return false;
    }
    async createMasterPassword() {
        console.log('I see you haven\'t logged in yet!');
        var masterPasswordFirstAttempt = 'firstAttempt';
        var masterPasswordSecondAttempt = 'secondAttempt';
        while (masterPasswordFirstAttempt !== masterPasswordSecondAttempt) {
            const prompt = (0, prompt_sync_1.default)({ sigint: true });
            try {
                masterPasswordFirstAttempt = prompt('Create a master password: ', { echo: '*' });
                masterPasswordSecondAttempt = prompt('Please re enter your password: ', { echo: '*' });
            }
            catch {
                process.exit(1);
            }
            if (masterPasswordFirstAttempt !== masterPasswordSecondAttempt) {
                console.log('Passwords must match!');
                continue;
            }
            const passwordResult = password_1.Password.CreatePassword(masterPasswordFirstAttempt);
            if (!passwordResult.isSuccessful) {
                console.log(passwordResult.message);
                masterPasswordFirstAttempt = 'firstAttempt';
                masterPasswordSecondAttempt = 'secondAttempt';
                continue;
            }
            break;
        }
        return bcrypt_1.default.hashSync(masterPasswordFirstAttempt, 0);
    }
};
exports.AuthenticationService = AuthenticationService;
exports.AuthenticationService = AuthenticationService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(sessionRepository_1.SessionRepository)),
    __metadata("design:paramtypes", [sessionRepository_1.SessionRepository])
], AuthenticationService);
