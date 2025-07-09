import path from 'node:path';
import fs from 'node:fs';
import promptSync from 'prompt-sync';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { Password } from '../../domain/models/password';
import { Session } from './session';

export namespace authenticationService {
    export async function validateSession(): Promise<boolean> {
        const secretFilePath = path.join(require('os').homedir(), 'confidant', 'dcc8d9ed-5ba1-4797-91b4-0fba25427356');

        if (!fs.existsSync(secretFilePath)) {
            const masterPassword = await createMasterPassword();

            //TODO: Session information will be stored on database in the future
            var session = new Session(masterPassword, moment().add(10, 'minutes').toISOString(true));

            fs.writeFileSync(secretFilePath, JSON.stringify(session));

            return true;
        }

        return await validateSessionInformation(secretFilePath);
    }

    async function validateSessionInformation(secretFilePath: string): Promise<boolean> {

        const currentSessionJson: string = fs.readFileSync(secretFilePath, { encoding: 'utf-8' });

        const currentSession: Session = JSON.parse(currentSessionJson);

        if (currentSession.expirationDate === undefined ||
            currentSession.masterPassword === undefined) {
            return false;
        }

        if (!moment().isAfter(currentSession.expirationDate)) {
            return true;
        }

        console.log('Session expired');

        const prompt = promptSync({ sigint: true });

        const masterPassword = prompt('Please re enter your password: ', { echo: '*' });

        if (await bcrypt.compare(masterPassword, currentSession.masterPassword)) {
            var session = new Session(currentSession.masterPassword, moment().add(10, 'minutes').toISOString(true));

            fs.writeFileSync(secretFilePath, JSON.stringify(session));

            return true;
        }

        console.log('Invalid master password');

        return false;
    }

    async function createMasterPassword(): Promise<string> {
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

        return bcrypt.hashSync(masterPasswordFirstAttempt, 0);
    }
}
