declare global {
    interface String {
        isNullOrWhiteSpace(): boolean;
    }
}

String.prototype.isNullOrWhiteSpace = function (): boolean {
    return this === null || this === undefined || this.trim() === '';
}

export { }; 