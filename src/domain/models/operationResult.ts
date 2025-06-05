export type OperationResult<T> =
    | { isSuccessful: true; value: T; message: string }
    | { isSuccessful: false; value: null; message: string };

export function createSuccessResult<T>(value: T, message = 'Success'): OperationResult<T> {
    return {
        isSuccessful: true,
        value,
        message,
    };
}

export function createErrorResult<T>(message: string): OperationResult<T> {
    return {
        isSuccessful: false,
        value: null,
        message,
    };
}