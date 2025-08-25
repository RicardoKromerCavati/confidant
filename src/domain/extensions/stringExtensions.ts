declare global {
    interface String {
        isNullOrWhiteSpace(): boolean;
        hasSpecialChars(): boolean;
        hasNumbers(): boolean;
    }
}

String.prototype.isNullOrWhiteSpace = function (): boolean {
    return this === null || this === undefined || this.trim() === '' || this.match(/^ *$/) !== null;
}

String.prototype.hasSpecialChars = function (): boolean {
    const specialCharsRegex: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return specialCharsRegex.test(this.valueOf());
}

String.prototype.hasNumbers = function (): boolean {
    return /\d/.test(this.valueOf());
}

export { }; 