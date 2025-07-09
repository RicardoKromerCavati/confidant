#!/usr/bin/env node
import { Command } from 'commander';
import { asignCredentialCommands as asignCredentialCommands } from './presentation/commands/credentials';
import { authenticationService } from './application/master-password/authenticationService';

const commandName = 'confidant';
const description = 'Your favorite password manager';
const version = '1.0.0.1';

const originalAction = Command.prototype.action;

Command.prototype.action = function (
    this: Command,
    fn: (...args: any[]) => any | Promise<any>
): Command {
    return originalAction.call(this, async (...args: any[]) => {
        if (await logUserIn()) {
            return fn(...args);
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

async function logUserIn(): Promise<boolean> {
    const sessionResult = await authenticationService.validateSession();

    if (sessionResult) {
        return true;
    }

    return false;
}