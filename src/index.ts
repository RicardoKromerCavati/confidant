#!/usr/bin/env node
import { Command, Option } from 'commander';
import { assignCredentialCommands } from './presentation/commands/credentials';
import { assignProgramCommands } from './presentation/commands/program';
import { AuthenticationService } from './application/sessions/authenticationService';
import { DatabaseContext } from './infrastructure/databaseContext';
import { container } from 'tsyringe';
import { version } from '../package.json';

const programName = 'confidant';
const description = 'Your favorite password manager';

async function startProgram() {
    await container.resolve(DatabaseContext).initializeDatabase();

    const originalAction = Command.prototype.action;

    Command.prototype.action = function (
        this: Command,
        fn: (...args: any[]) => any | Promise<any>
    ): Command {
        return originalAction.call(this, async (...args: any[]) => {

            if (await logUserIn()) {
                await fn(...args);
            }
            process.exit(0);
        });
    };

    const program = new Command();

    program
        .name(programName)
        .description(description)
        .version(version, '--version, --v', 'Version of the program.');;

    assignProgramCommands(program);
    assignCredentialCommands(program);

    program.parse();
}

async function logUserIn(): Promise<boolean> {

    const authenticationService: AuthenticationService = container.resolve(AuthenticationService);

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