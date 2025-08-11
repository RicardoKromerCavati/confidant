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
var Password_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
const core_1 = require("@mikro-orm/core");
const operationResultHandler = __importStar(require("../models/operationResult"));
let Password = Password_1 = class Password {
    constructor(password) {
        this.value = '';
        this.value = password;
    }
    static CreatePassword(valuePassword) {
        const [success, message] = this.validatePassword(valuePassword);
        if (!success) {
            return operationResultHandler.createErrorResult(message);
        }
        var password = new Password_1(valuePassword);
        return operationResultHandler.createSuccessResult(password);
    }
    static validatePassword(password) {
        const errorMessage = 'You must create a stronger password, it must have at least 12 characters, one special character and one number!';
        if (password.isNullOrWhiteSpace()) {
            return [false, 'Password must not be empty'];
        }
        if (password.length < 12) {
            return [false, errorMessage];
        }
        if (!password.hasSpecialChars()) {
            return [false, errorMessage];
        }
        if (!password.hasNumbers()) {
            return [false, errorMessage];
        }
        return [true, ''];
    }
};
exports.Password = Password;
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Password.prototype, "value", void 0);
exports.Password = Password = Password_1 = __decorate([
    (0, core_1.Embeddable)(),
    __metadata("design:paramtypes", [String])
], Password);
