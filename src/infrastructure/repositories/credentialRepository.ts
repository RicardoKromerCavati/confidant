import Datastore from 'nedb-promises';
import * as os from 'os';
import { Credential } from '../../domain/models/credential';

const path = require('node:path')

export class CredentialRepository {
    private _databaseFilePath = path.join(os.homedir(), 'confidant', 'confidant.db');
    private _db = Datastore.create({ filename: this._databaseFilePath, autoload: true });

    public async createCredential(credential: Credential) {
        await this._db.insert<Credential>(credential);
    }

    public async getCredentialNames(): Promise<Credential[]> {
        return await this._db.find<Credential>({});
    }
}