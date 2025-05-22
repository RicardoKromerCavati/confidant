import Datastore from 'nedb-promises';
import * as os from 'os';
import { Credential } from '../../domain/models/credential';

const path = require('node:path')

export class CredentialRepository {
    public async createCredential(credential: Credential) {
        const databaseFilePath = path.join(os.homedir(), 'confidant', 'confidant.db');

        const db = Datastore.create({ filename: databaseFilePath, autoload: true });

        const newCredential = await db.insert<Credential>(credential);
    }

    public async getCredentialNames(): Promise<Credential[]> {
        const databaseFilePath = path.join(os.homedir(), 'confidant', 'confidant.db');
        const db = Datastore.create({ filename: databaseFilePath, autoload: true });
        return await db.find<Credential>({});
    }
}