#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const credentials_1 = require("./presentation/commands/credentials");
const authenticationService_1 = require("./application/sessions/authenticationService");
const databaseContext_1 = require("./infrastructure/databaseContext");
const tsyringe_1 = require("tsyringe");
const commandName = 'confidant';
const description = 'Your favorite password manager';
const version = '1.0.0.1';
async function startProgram() {
    await tsyringe_1.container.resolve(databaseContext_1.DatabaseContext).initializeDatabase();
    const originalAction = commander_1.Command.prototype.action;
    commander_1.Command.prototype.action = function (fn) {
        return originalAction.call(this, async (...args) => {
            if (await logUserIn()) {
                await fn(...args);
            }
            process.exit(0);
        });
    };
    const program = new commander_1.Command();
    program
        .name(commandName)
        .description(description)
        .version(version);
    (0, credentials_1.asignCredentialCommands)(program);
    program.parse(process.argv);
}
async function logUserIn() {
    const authenticationService = tsyringe_1.container.resolve(authenticationService_1.AuthenticationService);
    const sessionResult = await authenticationService.validateSession();
    if (sessionResult) {
        return true;
    }
    return false;
}
startProgram().catch(err => {
    console.error(err);
    process.exit(1);
});
