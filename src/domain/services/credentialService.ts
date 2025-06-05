import { Credential } from '../../domain/models/credential';
import { CredentialRepository } from '../../infrastructure/repositories/credentialRepository';
import '../extensions/stringExtensions';
import '../services/passwordService';
import { PasswordService } from '../services/passwordService';
import * as readline from 'readline/promises';
import { Category } from 'typescript-logging-category-style';

export class CredentialService {
    public static createCredential(credentialName: string, username: string, password: string): void {

        try {
            if (password == undefined || password.isNullOrWhiteSpace()) {
                const passwordLength: number = 12;
                password = PasswordService.createPassword(passwordLength);
            }

            const [result, credential] = Credential.Create(credentialName, username, password);

            if (result && credential != null) {
                new CredentialRepository().createCredential(credential);

                return;
            }

            console.log('Credential not created');

        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }

    public static async getCredentials() {
        try {
            const foundCredentials = await new CredentialRepository().getCredentialNames();

            if (foundCredentials.length <= 0) {
                console.log('There are no credentials available');
                return;
            }

            for (let index = 0; index < foundCredentials.length; index++) {
                const element = foundCredentials[index];

                let credential = { Id: element.id, CredentialName: element.credentialName, Username: element.username };

                console.log(JSON.stringify(credential));
            }

        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }

    public static async getCredentialPassword(id: number) {
        try {
            const foundCredential = await new CredentialRepository().getCredentialById(id);

            if (foundCredential == null) {
                console.log('Could not find credential');
                return;
            }

            const clipboardy = (await import("clipboardy")).default
            clipboardy.write(foundCredential.password);

            console.log('Credential password copied to clipboard');

        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }

    public static async generatePassword() {
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

        var useNumbers = await this.askYesOrNoQuestion(rl, 'Would you like to include numbers? [y/n]: ');
        var useSpecialChars = await this.askYesOrNoQuestion(rl, 'Would you like to include special characters? [y/n]: ');
        var useUpperCaseChars = await this.askYesOrNoQuestion(rl, 'Would you like to include upper case characters? [y/n]: ');

        rl.close();

        const generatedPasword = PasswordService.createPassword(length, useNumbers, useSpecialChars, useUpperCaseChars);

        const clipboardy = (await import("clipboardy")).default

        clipboardy.write(generatedPasword);

        console.log('Password was copied to your clipboard');
    }

    private static async askYesOrNoQuestion(rl: readline.Interface, question: string): Promise<boolean> {

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
}