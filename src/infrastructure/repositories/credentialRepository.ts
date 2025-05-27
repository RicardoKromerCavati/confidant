import Datastore from 'nedb-promises';
import * as os from 'os';
import { Credential } from '../../domain/models/credential';

const path = require('node:path');

export class CredentialRepository {
    private _databaseFilePath = path.join(os.homedir(), 'confidant', 'confidant.db');
    private _db = Datastore.create({ filename: this._databaseFilePath, autoload: true });

    public async createCredential(credential: Credential) {
        const c = await this._db
            .find<Credential>({})
            .sort({ id: -1 })
            .limit(1)
            .exec();

        let id: number = 0;
        if (c.length == 0) {
            id = 1;
        }
        else {
            id = c[0].id + 1;
        }

        credential.id = id;

        await this._db.insert<Credential>(credential);
    }

    public async getCredentialNames(): Promise<Credential[]> {
        return (await this._db.find<Credential>({}).sort({ id: 1 }));
    }
}