import { Credential } from '../../../src/domain/models/credential';
import { Password } from '../../../src/domain/models/password';
import { CredentialRepository } from '../../../src/infrastructure/repositories/credentialRepository';
import { CredentialService } from '../../../src/domain/services/credentialService';

const credentialRepositoryMock = <jest.Mock<CredentialRepository>>CredentialRepository;

//TODO: Continue here, find out how to create mocks.
const mockRepo: jest.Mocked<CredentialRepository> = {};

const credentialService = new CredentialService(mockRepo);

test('OnCreate_WhenNoValuesAreProvided_ShouldReturnFalseAndNull', () => {
    expect(Credential.Create('', '', '')).toStrictEqual([false, null]);
});

test('OnCreate_WhenOnlyCredentialNameIsProvided_ShouldReturnFalseAndNull', () => {
    const credentialName = 'credentialName';
    expect(Credential.Create(credentialName, '', '')).toStrictEqual([false, null]);
});

test('OnCreate_WhenCredentialNameAndUsernameAreProvided_ShouldReturnFalseAndNull', () => {
    const credentialName = 'credentialName';
    const username = 'username';
    expect(Credential.Create(credentialName, username, '')).toStrictEqual([false, null]);
});

test('OnCreate_WhenCredentialNameAndUsernameAreProvidedAndInvalidPasswordIsUsed_ShouldReturnFalseAndNull', () => {
    const credentialName = 'credentialName';
    const username = 'username';
    const password = 'password'
    expect(Credential.Create(credentialName, username, password)).toStrictEqual([false, null]);
});

test('OnCreate_WhenValidInformationIsProvided_ShouldReturnTrueAndCorrectResult', () => {
    const credentialName = 'credentialName';
    const username = 'username';
    const passwordText = 'superPowerfullAndStrongP@ssw0rd';
    
    const passwordResult = Password.CreatePassword("superPowerfullAndStrongP@ssw0rd");
    const password = passwordResult.value;

    const [success, credential] = Credential.Create(credentialName, username, passwordText);

    expect(success).toBe(true);
    expect(credential).not.toBeNull();
    expect(credential?.credentialName).toBe(credentialName);
    expect(credential?.username).toBe(username);
    expect(credential?.password).toStrictEqual(password);
});