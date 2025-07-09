import '../extensions/stringExtensions';
import '../models/password';
import { Password } from '../models/password';

export class Credential {
    id: number = 0;
    credentialName: string = '';
    username: string = '';
    password: Password;

    private constructor(credentialName: string, username: string, password: Password) {
        this.credentialName = credentialName;
        this.username = username;
        this.password = password;
    }

    public static Create(credentialName: string, username: string, password: string): [boolean, Credential | null] {

        var [result, message] = Credential.validateCredentialName(credentialName);

        if (result == false) {
            console.log(message);
            return [false, null];
        }

        [result, message] = Credential.validateUsername(username);

        if (result == false) {
            console.log(message);
            return [false, null];
        }

        const passwordResult = Password.CreatePassword(password);

        if (!passwordResult.isSuccessful) {
            console.log(passwordResult.message);
            return [false, null];
        }

        return [true, new Credential(credentialName, username, passwordResult.value)];
    }

    private static validateCredentialName(credentialName: string): [boolean, string] {
        if (credentialName.isNullOrWhiteSpace()) {
            return [false, 'Credential name must not be empty'];
        }

        return [true, ''];
    }

    private static validateUsername(username: string): [boolean, string] {
        if (username.isNullOrWhiteSpace()) {
            return [false, 'Username must not be empty'];
        }

        return [true, ''];
    }
}