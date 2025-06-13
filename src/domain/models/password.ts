import { OperationResult } from '../models/operationResult';
import * as operationResultHandler from '../models/operationResult';

export class Password {

    value: string = '';

    private constructor(password: string) {
        this.value = password;
    }

    public static CreatePassword(valuePassword: string): OperationResult<Password> {
        const [success, message] = this.validatePassword(valuePassword);

        if (!success) {
            return operationResultHandler.createErrorResult(message);
        }

        var password = new Password(valuePassword);

        return operationResultHandler.createSuccessResult(password);
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