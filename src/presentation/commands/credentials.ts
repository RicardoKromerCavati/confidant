import { Command } from 'commander';
import { CredentialService } from '../../domain/services/credentialService';

export function asignCredentialCommands(program: Command) {
    program
        .command('create')
        .alias('cc')
        .alias('create-credential')
        .description('Create new credential')
        .argument('<Item name>', 'Meaningful name for item (required)')
        .argument('<Username>', 'Username or email used in credential (required)')
        .argument('[Password]', 'Your item password (optional - send blank and confidant will create one for you)')
        .action(createCredential);

    program
        .command('list')
        .alias('l')
        .description('Retrieve all items')
        .action(getCredentials);

    program
        .command('get')
        .alias('gp')
        .alias('get-password')
        .description('Get item password from id')
        .argument('<id>', 'Credential id')
        .action((credentialId: string) => {

            const convertedCredentialId = Number(credentialId);

            if (isNaN(convertedCredentialId)) {
                console.log('Please enter a numeric credential id');
                return;
            }

            CredentialService.getCredentialPassword(convertedCredentialId);
        });

    program
        .command('genpass')
        .alias('generate-password')
        .description('Generate new password')
        .action(() => CredentialService.generatePassword());

}

function createCredential(credentialName: string, username: string, password: string): void {
    const result = CredentialService.createCredential(credentialName, username, password);

    if (result.isSuccessful == false) {
        console.log(result.message);
        return;
    }

    console.log('Credential created successfully');
}

async function getCredentials(): Promise<void> {
    const result = await CredentialService.getCredentials();

    if (result.isSuccessful == false) {
        console.log(result.message);
        return;
    }

    const foundCredentials = result.value;

    for (let index = 0; index < foundCredentials.length; index++) {
        const element = foundCredentials[index];

        let credential = { Id: element.id, CredentialName: element.credentialName, Username: element.username };

        console.log(JSON.stringify(credential));
    }
}