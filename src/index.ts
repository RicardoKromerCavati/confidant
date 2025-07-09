#!/usr/bin/env node
import "reflect-metadata";
import { Command } from 'commander';
import { asignCredentialCommands as asignCredentialCommands } from './presentation/commands/credentials';
import { AuthenticationService } from './application/sessions/authenticationService';
import { DatabaseContext } from './infrastructure/databaseContext';
import { container } from 'tsyringe';

const commandName = 'confidant';
const description = 'Your favorite password manager';
const version = '1.0.0.1';

async function startProgram() {
    await new DatabaseContext().initializeDatabase();

    const originalAction = Command.prototype.action;

    Command.prototype.action = function (
        this: Command,
        fn: (...args: any[]) => any | Promise<any>
    ): Command {
        return originalAction.call(this, async (...args: any[]) => {

            if (await logUserIn()) {
                await fn(...args);
                process.exit(0);
            }
        });
    };

    const program = new Command();
    program
        .name(commandName)
        .description(description)
        .version(version);

    asignCredentialCommands(program);

    program.parse(process.argv);
}

async function logUserIn(): Promise<boolean> {

    const authenticationService : AuthenticationService = container.resolve(AuthenticationService);

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