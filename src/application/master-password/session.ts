export class Session {
    expirationDate: string = '';
    masterPassword: string = '';

    public constructor(masterPassword: string, expirationDate: string) {
        this.masterPassword = masterPassword;
        this.expirationDate = expirationDate;
    }
}