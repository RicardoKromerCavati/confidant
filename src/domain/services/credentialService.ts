import { Credential } from '../../domain/models/credential'
export class CredentialService {
    public static createCredential(credentialName: string, username: string, password: string): void {
        try {
            const [result, credential] = Credential.Create(credentialName, username, password);

            if (result && credential != null) {
                console.log(`[FROM SERVICE]\nCredential name: ${credential.credentialName}\nUsername: ${credential.username}\nPassword: ${credential.password}`);
                return;
            }

            console.log('Credential not created');

        } catch (error) {
            console.log(error);
        }
    }
}