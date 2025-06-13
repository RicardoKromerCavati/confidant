import path from 'node:path';
import fs from 'node:fs';
import promptSync from 'prompt-sync';
import bcrypt from 'bcrypt';
import { Password } from '../domain/models/password';

export namespace authenticationService {
    export async function validateSession(): Promise<boolean> {
        const secretFile = path.join(require('os').homedir(), 'dcc8d9ed-5ba1-4797-91b4-0fba25427356');

        if (!fs.existsSync(secretFile)) {
            await createMasterPassword();
        }
        return true;
    }

    async function createMasterPassword() {
        console.log('I see you haven\'t logged in yet!');

        var masterPasswordFirstAttempt = 'firstAttempt';
        var masterPasswordSecondAttempt = 'secondAttempt';

        while (masterPasswordFirstAttempt !== masterPasswordSecondAttempt) {
            const prompt = promptSync({ sigint: true });

            try {
                masterPasswordFirstAttempt = prompt('Create a master password: ', { echo: '*' });
                masterPasswordSecondAttempt = prompt('Please re enter your password: ', { echo: '*' });
            } catch {
                process.exit(1);
            }

            if (masterPasswordFirstAttempt !== masterPasswordSecondAttempt) {
                console.log('Passwords must match!');
                continue;
            }

            const passwordResult = Password.CreatePassword(masterPasswordFirstAttempt);

            if (!passwordResult.isSuccessful) {
                console.log(passwordResult.message);
                masterPasswordFirstAttempt = 'firstAttempt';
                masterPasswordSecondAttempt = 'secondAttempt';
                continue;
            }

            break;
        }

        //TODO: Continue here, if passwords are the same and match the rules, save it and continue.
        //TODO: Create new unit tests.
    }
}