import { CredentialRepository } from '../../../src/infrastructure/repositories/credentialRepository';
import { CredentialService } from '../../../src/domain/services/credentialService';
import { DatabaseContext } from '../../../src/infrastructure/databaseContext';
import { Credential } from '../../../src/domain/models/credential';

jest.mock('../../../src/infrastructure/repositories/credentialRepository');

describe('CredentialServiceTests', () => {
    
    let credentialRepositoryMock: jest.Mocked<CredentialRepository>;
    let credentialService: CredentialService;

    beforeEach(() => {

        credentialRepositoryMock = new CredentialRepository(new DatabaseContext()) as jest.Mocked<CredentialRepository>;
        credentialService = new CredentialService(credentialRepositoryMock);
    });

    test('createCredential_WhenNoValuesAreProvided_ShouldReturnFalseOperationResultWithCorrectMessage', async () => {

        // Arrange
        const credentialName: string = '';
        const username: string = '';
        const password: string = '';
        const expectedMessage = 'Credential not createdd';

        // Act
        const operationResult = await credentialService.createCredential(credentialName, username, password);

        // Assert
        expect(operationResult.isSuccessful).toBe(false);
        expect(operationResult.value).toBe(null);
        expect(operationResult.message).toStrictEqual(expectedMessage);
    });

    test('createCredential_WhenOnlyCredentialNameIsProvided_ShouldReturnFalseOperationResultWithCorrectMessage', async () => {

        // Arrange
        const credentialName = 'credentialName';
        const expectedMessage = 'Credential not created';

        // Act
        const operationResult = await credentialService.createCredential(credentialName, '', '');

        // Assert
        expect(operationResult.isSuccessful).toBe(false);
        expect(operationResult.value).toBe(null);
        expect(operationResult.message).toStrictEqual(expectedMessage);
    });

    test('createCredential_WhenOnlyPasswordIsNotProvided_ShouldReturnFalseAndNull', async () => {

        // Arrange
        const credentialName = 'credentialName';
        const username = 'username';
        const expectedMessage = 'Success';

        // Act
        const operationResult = await credentialService.createCredential(credentialName, username, '');

        // Assert
        expect(operationResult.isSuccessful).toBe(true);
        expect(operationResult.value).toBe(true);
        expect(operationResult.message).toStrictEqual(expectedMessage);
    });

    test('createCredential_WhenCredentialNameAndUsernameAreProvidedAndInvalidPasswordIsUsed_ShouldReturnFalseAndNull', async () => {

        // Arrange
        const credentialName = 'credentialName';
        const username = 'username';
        const password = 'password'
        const expectedMessage = 'Credential not created';

        // Act
        const operationResult = await credentialService.createCredential(credentialName, username, password);

        // Assert
        expect(operationResult.isSuccessful).toBe(false);
        expect(operationResult.value).toBe(null);
        expect(operationResult.message).toStrictEqual(expectedMessage);
    });

    test('createCredential_WhenValidInformationIsProvided_ShouldReturnTrueAndCorrectResult', async () => {

        // Arrange
        const credentialName = 'credentialName';
        const username = 'username';
        const passwordText = 'superPowerfullAndStrongP@ssw0rd';
        const expectedMessage = 'Success';

        // Act
        const operationResult = await credentialService.createCredential(credentialName, username, passwordText);

        // Assert
        expect(operationResult.isSuccessful).toBe(true);
        expect(operationResult.value).toBe(true);
        expect(operationResult.message).toStrictEqual(expectedMessage);
    });

    test('getCredentials_WhenThereAreNoCredentials_ShouldFailWithExpectedMessage', async () => {

        // Arrange
        const expectedMessage = 'There are no credentials available';
        const foundCredentials: Credential[] = [];

        credentialRepositoryMock.getCredentialNames.mockResolvedValue(foundCredentials);

        // Act
        const operationResult = await credentialService.getCredentials();

        // Assert
        expect(operationResult.isSuccessful).toBe(false);
        expect(operationResult.value).toBe(null);
        expect(operationResult.message).toStrictEqual(expectedMessage);
    });

    test('getCredentials_WhenThereAreCredentials_ShouldReturnSuccessWithExpectedCredentialArray', async () => {

        // Arrange
        const expectedId = 0;

        const expectedMessage = 'Success';
        const samplePassword = 'P@ssw0rd4321';
        const sampleCredentialName = 'sampleCredentialName';
        const sampleUsername = 'sampleUsername';

        const [_, sampleCredential] = Credential.Create(0, sampleCredentialName, sampleUsername, samplePassword);
        const foundCredentials: Credential[] = [sampleCredential!];

        credentialRepositoryMock.getCredentialNames.mockResolvedValue(foundCredentials);

        // Act
        const operationResult = await credentialService.getCredentials();

        // Assert
        expect(operationResult.isSuccessful).toBe(true);
        expect(operationResult.value).not.toBeNull();
        expect(operationResult.message).toStrictEqual(expectedMessage);
        expect(operationResult.value?.length).toBeGreaterThan(0);

        const credential = operationResult.value![0];

        expect(credential.credentialName).toStrictEqual(sampleCredentialName);
        expect(credential.username).toStrictEqual(sampleUsername);
        expect(credential.password.value).toStrictEqual(samplePassword);
        expect(credential.id).toStrictEqual(expectedId);
    });

    test('getCredentialPassword_WhenCredentialIsFound_ShouldReturnSuccessWithExpectedPassword', async () => {

        // Arrange
        const credentialId = 1;

        const expectedMessage = 'Success';
        const samplePassword = 'P@ssw0rd4321';

        const [_, sampleCredential] = Credential.Create(credentialId, 'sampleCredentialName', 'sampleUsername', samplePassword);

        credentialRepositoryMock.getCredentialById.mockImplementation((id: number) => {
            if (id == credentialId) {
                return Promise.resolve(sampleCredential);
            }
            return Promise.resolve(null);
        });

        // Act
        const operationResult = await credentialService.getCredentialPassword(credentialId);

        // Assert
        expect(operationResult.isSuccessful).toBe(true);
        expect(operationResult.value).not.toBeNull();
        expect(operationResult.message).toStrictEqual(expectedMessage);
        expect(operationResult.value?.length).toBeGreaterThan(0);

        const password = operationResult.value;
        expect(password).toStrictEqual(samplePassword);
    });

    test('getCredentialPassword_WhenCredentialIsNotFound_Should', async () => {

        // Arrange
        const invalidCredentialId = 0;
        const validCredentialId = 1;
        const expectedMessage = 'Could not find credential';

        const [_, sampleCredential] = Credential.Create(invalidCredentialId, 'sampleCredentialName', 'sampleUsername', 'P@ssw0rd4321');

        credentialRepositoryMock.getCredentialById.mockImplementation((id: number) => {
            if (id == validCredentialId) {
                return Promise.resolve(sampleCredential);
            }
            return Promise.resolve(null);
        });

        // Act
        const operationResult = await credentialService.getCredentialPassword(invalidCredentialId);

        // Assert
        expect(operationResult.isSuccessful).toBe(false);
        expect(operationResult.value).toBeNull();
        expect(operationResult.message).toStrictEqual(expectedMessage);
    });
});