import { Credential } from '../../domain/models/credential';
import { CredentialRepository } from '../../infrastructure/repositories/credentialRepository';
import '../extensions/stringExtensions';
import '../services/passwordService';
import { PasswordService } from '../services/passwordService';
import { OperationResult } from '../models/operationResult';
import * as operationResultHandler from '../models/operationResult';

export class CredentialService {

    //TODO: Inject repo.

    public static createCredential(credentialName: string, username: string, password: string): OperationResult<boolean> {

        try {
            if (password == undefined || password.isNullOrWhiteSpace()) {
                const defaultPasswordLength: number = 12;
                password = PasswordService.createPassword(defaultPasswordLength);
            }

            const [result, credential] = Credential.Create(credentialName, username, password);

            if (result && credential != null) {
                new CredentialRepository().createCredential(credential);

                return operationResultHandler.createSuccessResult<boolean>(true);
            }

            return operationResultHandler.createErrorResult<boolean>('Credential not created');

        } catch (error) {
            return operationResultHandler.createErrorResult<boolean>(JSON.stringify(error));
        }
    }

    public static async getCredentials(): Promise<OperationResult<Credential[]>> {
        try {
            const foundCredentials = await new CredentialRepository().getCredentialNames();

            if (foundCredentials.length <= 0) {
                return operationResultHandler.createErrorResult<Credential[]>('There are no credentials available');
            }

            return operationResultHandler.createSuccessResult<Credential[]>(foundCredentials);
        } catch (error) {
            return operationResultHandler.createErrorResult<Credential[]>(JSON.stringify(error));
        }
    }

    public static async getCredentialPassword(id: number): Promise<OperationResult<string>> {
        try {
            const foundCredential = await new CredentialRepository().getCredentialById(id);

            if (foundCredential == null) {
                return operationResultHandler.createErrorResult('Could not find credential');
            }

            return operationResultHandler.createSuccessResult(foundCredential.password.value)

        } catch (error) {
            return operationResultHandler.createErrorResult(JSON.stringify(error));
        }
    }

    public static generatePassword(length: number, useNumbers: boolean, useSpecialChars: boolean, useUpperCaseChars: boolean): OperationResult<string> {
        try {
            return operationResultHandler.createSuccessResult(PasswordService.createPassword(length, useNumbers, useSpecialChars, useUpperCaseChars));
        } catch (error) {
            return operationResultHandler.createErrorResult(JSON.stringify(error));
        }
    }
}