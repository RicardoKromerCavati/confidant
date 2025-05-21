//import { Credential } from '../../../src/domain/models/credential';

//const CredentialClass = require('../../../src/domain/models/credential');
import { log } from 'console';
import { Credential } from '../../../src/domain/models/credential';


test('OnCreate_WhenNoValuesArePassed_ShouldReturnFalseAndNull', () => {
    expect(Credential.Create('', '', '')).toStrictEqual([false, null]);
});