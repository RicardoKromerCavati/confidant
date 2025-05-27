import '../extensions/stringExtensions';

export class PasswordService {
    public static createPassword(characterAmount: number): string {

        const passwordOptions = {
            num: "1234567890",
            specialChar: "!@#$%&'()*+,^-./:;<=>?[]_`{~}|",
            lowerCase: "abcdefghijklmnopqrstuvwxyz",
            upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        };

        let passInfo : string = "";

        const passChars : string[] = [];

        passInfo += passwordOptions.num;

        passChars.push(PasswordService.getRandomChar(passwordOptions.num));

        passInfo += passwordOptions.specialChar;

        passChars.push(PasswordService.getRandomChar(passwordOptions.specialChar));

        passInfo += passwordOptions.lowerCase;

        passChars.push(PasswordService.getRandomChar(passwordOptions.lowerCase));

        passInfo += passwordOptions.upperCase;

        passChars.push(PasswordService.getRandomChar(passwordOptions.upperCase));

        while (passChars.length < characterAmount) {
            passChars.push(PasswordService.getRandomChar(passInfo));
        };

        for (let i = passChars.length - 1; i > 0; i--) {
            const swapIndex = Math.floor(Math.random() * (i + 1));
            const temp = passChars[i];
            passChars[i] = passChars[swapIndex];
            passChars[swapIndex] = temp;
        };

        return passChars.join("");
    }

    private static getRandomChar(fromString: string): string {
        return fromString[Math.floor(Math.random() * fromString.length)];
    }
}