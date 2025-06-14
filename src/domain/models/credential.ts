import '../extensions/stringExtensions';

export class Credential {
    id: number = 0;
    credentialName: string = '';
    username: string = '';
    password: string = '';

    private constructor(credentialName: string, username: string, password: string) {
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

        [result, message] = Credential.validatePassword(password);

        if (result == false) {
            console.log(message);
            return [false, null];
        }

        return [true, new Credential(credentialName, username, password)];
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

    private static validatePassword(password: string): [boolean, string] {
        const errorMessage = 'You must create a stronger password';

        if (password.isNullOrWhiteSpace()) {
            return [false, 'Password must not be empty'];
        }

        if (password.length < 12) {
            return [false, errorMessage];
        }

        if (!password.hasSpecialChars()) {
            return [false, errorMessage];
        }

        if (!password.hasNumbers()) {
            return [false, errorMessage];
        }

        return [true, ''];
    }
}