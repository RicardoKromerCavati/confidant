"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuccessResult = createSuccessResult;
exports.createErrorResult = createErrorResult;
function createSuccessResult(value, message = 'Success') {
    return {
        isSuccessful: true,
        value,
        message,
    };
}
function createErrorResult(message) {
    return {
        isSuccessful: false,
        value: null,
        message,
    };
}
