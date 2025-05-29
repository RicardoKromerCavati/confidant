import { Credential } from '../../domain/models/credential';
import { CredentialRepository } from '../../infrastructure/repositories/credentialRepository';
import '../extensions/stringExtensions';
import '../services/passwordService';
import { PasswordService } from '../services/passwordService';

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
            console.log(error);
        }
    }

    public static async getCredentials() {
        try {
            const foundCredentials = await new CredentialRepository().getCredentialNames();

            if (foundCredentials.length <= 0) {
                console.log('no credentials found');
                return;
            }

            for (let index = 0; index < foundCredentials.length; index++) {
                const element = foundCredentials[index];

                let credential = { Id: element.id, CredentialName: element.credentialName, Username: element.username };

                console.log(credential);
            }

        } catch (error) {
            console.log(error);
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
            console.log(error);
        }
    }
}