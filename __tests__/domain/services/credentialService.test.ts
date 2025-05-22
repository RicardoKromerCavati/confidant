//import { Credential } from '../../../src/domain/models/credential';

//const CredentialClass = require('../../../src/domain/models/credential');
import { log } from 'console';
import { Credential } from '../../../src/domain/models/credential';


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
    const password = 'superPowerfullAndStrongP@ssw0rd';

    const [success, credential] = Credential.Create(credentialName, username, password);

    expect(success).toBe(true);
    expect(credential?.credentialName).toBe(credentialName);
    expect(credential?.username).toBe(username);
    expect(credential?.password).toBe(password);
});