import Datastore from 'nedb-promises';
import * as os from 'os';
import { Credential } from '../../domain/models/credential';
import { DbCredential } from '../models/dbCredential';
import path from 'node:path';
import { injectable, inject } from "tsyringe";
import { DatabaseContext } from '../databaseContext';

@injectable()
export class CredentialRepository {

    private _databaseContext: DatabaseContext;

    constructor(@inject(DatabaseContext) databaseContext: DatabaseContext) {
        this._databaseContext = databaseContext;
    }

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

        const context = await this._databaseContext.getContext();

        await context.persistAndFlush(credential.toDbCredential());
    }

    public async getCredentialNames(): Promise<Credential[]> {
        const context = await this._databaseContext.getContext();

        const dbCredentials = await context.findAll(DbCredential);

        const credentials: Array<Credential> = new Array<Credential>(dbCredentials.length);

        for (let index = 0; index < dbCredentials.length; index++) {
            const username = dbCredentials[index].username;
            const password = dbCredentials[index].password;
            const credentialName = dbCredentials[index].credentialName;

            const [_, credential] = Credential.Create(credentialName, username, password.value);

            credentials[index] = credential!;
        }

        return credentials;
    }

    public async getCredentialById(credentialId: number): Promise<Credential | null> {
        const context = await this._databaseContext.getContext();

        const dbCredential = await context.findOne(DbCredential, credentialId);

        if (dbCredential === null ||
            dbCredential === undefined) {
            return null;
        }

        //TODO: Create a better way to convert credential objects.
        const [_, credential] = Credential.Create(dbCredential.credentialName, dbCredential.username, dbCredential.password.value);

        return credential;
    }
}