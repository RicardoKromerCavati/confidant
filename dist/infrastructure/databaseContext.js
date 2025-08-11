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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseContext = void 0;
const libsql_1 = require("@mikro-orm/libsql");
const tsyringe_1 = require("tsyringe");
const path_1 = __importDefault(require("path"));
const os = __importStar(require("os"));
let DatabaseContext = class DatabaseContext {
    async initializeDatabase() {
        await this.create();
        await this._orm.schema.ensureDatabase();
        await this._orm.schema.updateSchema();
    }
    async getContext() {
        return this._orm.em.fork();
    }
    async create() {
        const rootDir = __dirname.includes('dist') ? 'dist' : 'src';
        const databaseEntitiesPath = path_1.default.resolve(__dirname, '..', '..', rootDir, 'infrastructure', 'models', '**', '*.{ts,js}');
        const databaseFilePath = path_1.default.join(os.homedir(), 'confidant', 'confidant.db');
        this._orm = await libsql_1.MikroORM.init({
            entities: [databaseEntitiesPath],
            dbName: databaseFilePath,
            password: 'samplePassword'
        });
    }
};
exports.DatabaseContext = DatabaseContext;
exports.DatabaseContext = DatabaseContext = __decorate([
    (0, tsyringe_1.injectable)(),
    (0, tsyringe_1.singleton)()
], DatabaseContext);
