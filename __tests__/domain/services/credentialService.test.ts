import { CredentialRepository } from '../../../src/infrastructure/repositories/credentialRepository';
import { CredentialService } from '../../../src/domain/services/credentialService';
import { DatabaseContext } from '../../../src/infrastructure/databaseContext';

jest.mock('../../../src/infrastructure/repositories/credentialRepository') ;
let credentialRepositoryMock: jest.Mocked<CredentialRepository> ;
credentialRepositoryMock = new CredentialRepository(new DatabaseContext()) as jest.Mocked<CredentialRepository> ;

const credentialService = new CredentialService(credentialRepositoryMock);

test('OnCreate_WhenNoValuesAreProvided_ShouldReturnFalseOperationResultWithCorrectMessage', async () => {

    // Arrange
    const credentialName: string = '';
    const username: string = '';
    const password: string = '';

    // Act
    const operationResult = await credentialService.createCredential(credentialName, username, password);

    // Assert
    expect(operationResult.isSuccessful).toBe(false);
    expect(operationResult.value).toBe(null);
    expect(operationResult.message).toStrictEqual('Credential not created');
});

test('OnCreate_WhenOnlyCredentialNameIsProvided_ShouldReturnFalseOperationResultWithCorrectMessage', async () => {

    // Arrange
    const credentialName = 'credentialName';

    // Act
    const operationResult = await credentialService.createCredential(credentialName, '', '');

    // Assert
    expect(operationResult.isSuccessful).toBe(false);
    expect(operationResult.value).toBe(null);
    expect(operationResult.message).toStrictEqual('Credential not created');
});

test('OnCreate_WhenOnlyPasswordIsNotProvided_ShouldReturnFalseAndNull', async () => {

    // Arrange
    const credentialName = 'credentialName';
    const username = 'username';

    // Act
    const operationResult = await credentialService.createCredential(credentialName, username, '');
    
    // Assert
    expect(operationResult.isSuccessful).toBe(true);
    expect(operationResult.value).toBe(true);
    expect(operationResult.message).toStrictEqual('Success');
});

test('OnCreate_WhenCredentialNameAndUsernameAreProvidedAndInvalidPasswordIsUsed_ShouldReturnFalseAndNull', async () => {

    // Arrange
    const credentialName = 'credentialName';
    const username = 'username';
    const password = 'password'

    // Act
    const operationResult = await credentialService.createCredential(credentialName, username, password);

    // Assert
    expect(operationResult.isSuccessful).toBe(false);
    expect(operationResult.value).toBe(null);
    expect(operationResult.message).toStrictEqual('Credential not created');
});

test('OnCreate_WhenValidInformationIsProvided_ShouldReturnTrueAndCorrectResult', async () => {
    
    // Arrange
    const credentialName = 'credentialName';
    const username = 'username';
    const passwordText = 'superPowerfullAndStrongP@ssw0rd';

    // Act
    const operationResult = await credentialService.createCredential(credentialName, username, passwordText);

    // Assert
    expect(operationResult.isSuccessful).toBe(true);
    expect(operationResult.value).toBe(true);
    expect(operationResult.message).toStrictEqual('Success');
});