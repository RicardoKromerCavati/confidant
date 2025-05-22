import { Credential } from '../../domain/models/credential';
import { CredentialRepository } from '../../infrastructure/repositories/credentialRepository';

export class CredentialService {
    public static createCredential(credentialName: string, username: string, password: string): void {
        try {
            const [result, credential] = Credential.Create(credentialName, username, password);

            if (result && credential != null) {
                console.log(`[FROM SERVICE]\nCredential name: ${credential.credentialName}\nUsername: ${credential.username}\nPassword: ${credential.password}`);

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
                console.log(element.credentialName);
            }

        } catch (error) {
            console.log(error);
        }
    }
}