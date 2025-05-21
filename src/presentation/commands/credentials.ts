import { Command } from 'commander';
import { CredentialService } from '../../domain/services/credentialService';

export function asignCredentialCommands(program: Command) {
    program
        .command('create-credential|create|cc')
        .description('Create new credential')
        .argument('<credentialName>', 'Credential name (you should chose a name you can remember to find the credential easily)')
        .argument('<username>', 'Username')
        .argument('<password>', 'Password')
        .action((credentialName: string, username: string, password: string) => {
            CredentialService.createCredential(credentialName, username, password);
        });
}