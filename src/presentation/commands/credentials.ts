import { Command } from 'commander';
import { CredentialService } from '../../domain/services/credentialService';
import * as readline from 'readline/promises';
import { container } from 'tsyringe';

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
        .action(getCredentialPasswordById);

    program
        .command('genpass')
        .alias('generate-password')
        .description('Generate new password')
        .action(createPassword);

}

async function createCredential(credentialName: string, username: string, password: string): Promise<void> {
    var credentialService = container.resolve(CredentialService);
    const result = await credentialService.createCredential(credentialName, username, password);

    if (result.isSuccessful == false) {
        console.log(result.message);
        return;
    }

    console.log('Credential created successfully');
}

async function getCredentials(): Promise<void> {
    var credentialService = container.resolve(CredentialService);
    const result = await credentialService.getCredentials();

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

async function getCredentialPasswordById(idStr: string): Promise<void> {
    var credentialService = container.resolve(CredentialService);
    const id = Number(idStr);

    if (isNaN(id)) {
        console.log('Please enter a numeric credential id');
        return;
    }

    const result = await credentialService.getCredentialPassword(id);

    if (!result.isSuccessful) {
        console.log(result.message);
        return;
    }
    
    const password = result.value;

    const clipboardy = (await import("clipboardy")).default
    await clipboardy.write(password);

    console.log('Password copied to clipboard!');
}

async function createPassword() {
    const { stdin: input, stdout: output } = require('node:process');

    var rl = readline.createInterface({ input, output });

    console.log('Generate new passowrd!');

    var length = 0;

    while (length == 0) {
        var answer = await rl.question('Please choose the length from 8 to 128: ');

        const convertedLenght = Number(answer);

        if (isNaN(convertedLenght)) {
            console.log('Please write a numeric value!');
            continue;
        }

        length = convertedLenght;

        if (length < 8 || length > 128) {
            length = 0;
            console.log('Please write a numeric value from 8 to 128!');
            continue;
        }

        break;
    }

    var useNumbers = await askYesOrNoQuestion(rl, 'Would you like to include numbers? [y/n]: ');
    var useSpecialChars = await askYesOrNoQuestion(rl, 'Would you like to include special characters? [y/n]: ');
    var useUpperCaseChars = await askYesOrNoQuestion(rl, 'Would you like to include upper case characters? [y/n]: ');

    rl.close();

    //TODO: make this use the instance
    const passwordResult = CredentialService.generatePassword(length, useNumbers, useSpecialChars, useUpperCaseChars);

    if (!passwordResult.isSuccessful) {
        console.log(passwordResult.message);
        return;
    }

    const generatedPassword = passwordResult.value;

    const clipboardy = (await import("clipboardy")).default

    await clipboardy.write(generatedPassword);

    console.log('Password was copied to your clipboard');

}

async function askYesOrNoQuestion(rl: readline.Interface, question: string): Promise<boolean> {

    var tempAnswer: string = '';

    var result = false;

    while (tempAnswer.isNullOrWhiteSpace()) {
        var answer = await rl.question(question);

        switch (answer) {
            case 'y':
            case 'Y':
                result = true;
                tempAnswer = answer;
                break;
            case 'n':
            case 'n':
                result = false;
                tempAnswer = answer;
                break;
            default:
                tempAnswer = '';
                console.log('Invalid answer, please use \'y\' or \'n\'');
                break;
        }
    }

    return result;
}