#!/usr/bin/env node
import { Command } from 'commander';
import { asignCredentialCommands as asignCredentialCommands } from './presentation/commands/credentials';

const commandName = 'confidant';
const description = 'Your favorite password manager';
const version = '1.0.0.1';

const program = new Command();
program
    .name(commandName)
    .description(description)
    .version(version);

asignCredentialCommands(program);

program.parse(process.argv);