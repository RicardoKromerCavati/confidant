#!/usr/bin/env node
import { Command } from 'commander';
import { loadCredentialCommands as loadCredentialCommands } from './presentation/commands/credentials';
const program = new Command();
program
    .name('my_cli_password_manager')
    .description('A simple password manager')
    .version('1.0.0');

loadCredentialCommands(program);

program.parse(process.argv);