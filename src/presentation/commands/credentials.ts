import { Command, Option } from 'commander';
import { CredentialService } from '../../domain/services/credentialService';
import * as readline from 'readline/promises';
import { container } from 'tsyringe';
import { stdin as input, stdout as output } from "node:process";
import { GuidedOption } from './models/guidedOption';
import * as operationResultHandler from '../../domain/models/operationResult';
import { OperationResult } from '../../domain/models/operationResult';
import promptSync from 'prompt-sync';

export function assignCredentialCommands(program: Command) {
    program
        .command('new')
        .alias('n')
        .description('Create new credential.')
        .argument('<Item name>', 'Meaningful name for item (e.g Github, github.com) (Required).')
        .argument('<Account>', 'Username or email used in credential (Required).')
        .argument('[Password]', 'The credential password (optional - send blank and confidant will create one for you).', '')
        .action(createCredential);

    program
        .command('new-guided')
        .alias('ng')
        .description('Create new credential (with wizard).')
        .action(createCredentialWithWizard);

    program
        .command('list')
        .alias('l')
        .description('Get list of all credentials.')
        .action(getCredentials);

    program
        .command('get')
        .alias('g')
        .description('Get item password from id.')
        .argument('<id>', 'Credential identifier.')
        .action(getCredentialPasswordById);

    program
        .command('make')
        .alias('m')
        .description('Create new password.')
        .action(copyPasswordToClipboard);

    program
        .command('delete')
        .alias('d')
        .description('Delete credential.')
        .argument('<id>', 'Credential identifier.')
        .action(deleteCredentialById);

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

async function createCredentialWithWizard(): Promise<void> {

    console.log('Creating new credential!\n');

    var readLineInterface = readline.createInterface({ input, output });

    var credentialName = '';

    do {
        credentialName = await
            readLineInterface.question('Please type a name for the new item.\nIt should be something meaningful that helps you remember where this credential is from (e.g Github, github.com) and it can\'t be empty: ');
    } while (credentialName.isNullOrWhiteSpace())


    var username = '';

    do {
        username = await readLineInterface.question('Please enter the account.\nIt should be your username or email used to log in and it can\'t be empty: ');
    } while (username.isNullOrWhiteSpace());

    const shouldCreatePassword = await askYesOrNoQuestion(readLineInterface, 'Would like for confidant to create a password for you? [y/n]: ');

    readLineInterface.close();

    var password = '';

    if (shouldCreatePassword) {

        const createdPassword = (await createPassword()).value;
        password = createdPassword?.isNullOrWhiteSpace() ? '' : `${createdPassword}`;
    }
    else {
        const prompt = promptSync({ sigint: true });

        password = prompt('Please enter your password: ', { echo: '*' });
    }

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

        let credential = { Id: element.id, ItemName: element.credentialName, Account: element.username };

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

    const result = await credentialService.getCredentialById(id);

    if (!result.isSuccessful) {
        console.log(result.message);
        return;
    }

    const password = result.value;

    const clipboardy = (await import("clipboardy")).default
    await clipboardy.write(password);

    console.log('Password copied to clipboard!');
}

async function deleteCredentialById(idStr: string): Promise<void> {
    var credentialService = container.resolve(CredentialService);
    const id = Number(idStr);

    if (isNaN(id)) {
        console.log('Please enter a numeric credential id');
        return;
    }

    const result = await credentialService.deleteCredential(id);

    if (!result.isSuccessful) {
        console.log(result.message);
        return;
    }

    console.log('Credential deleted successfully!');
}

async function copyPasswordToClipboard() {
    const passwordCreationResult = await createPassword();

    if (passwordCreationResult.isSuccessful) {
        const clipboardy = (await import("clipboardy")).default

        await clipboardy.write(passwordCreationResult.value);

        console.log('Password was copied to your clipboard');

        return;
    }

    console.log(passwordCreationResult.message);
}

async function createPassword(): Promise<OperationResult<string>> {
    var rl = readline.createInterface({ input, output });

    console.log('Generate new password!\n');

    var length = 0;

    while (length == 0) {
        var answer = await rl.question('Please choose the length from 12 to 128: ');

        const convertedLenght = Number(answer);

        if (isNaN(convertedLenght)) {
            console.log('Please write a numeric value!');
            continue;
        }

        length = convertedLenght;

        if (length < 12 || length > 128) {
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

    const passwordResult = CredentialService.generatePassword(length, useNumbers, useSpecialChars, useUpperCaseChars);

    if (!passwordResult.isSuccessful) {
        return operationResultHandler.createErrorResult(JSON.stringify(passwordResult.message));
    }

    return operationResultHandler.createSuccessResult(passwordResult.value);
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