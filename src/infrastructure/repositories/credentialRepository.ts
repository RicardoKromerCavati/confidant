import { Credential } from '../../domain/models/credential';
import { DbCredential } from '../models/dbCredential';
import { injectable, inject } from "tsyringe";
import { DatabaseContext } from '../databaseContext';
import { DbPassword } from '../models/dbPassword';
import { OperationResult } from '../../domain/models/operationResult';

@injectable()
export class CredentialRepository {

    private _databaseContext: DatabaseContext;

    constructor(@inject(DatabaseContext) databaseContext: DatabaseContext) {
        this._databaseContext = databaseContext;
    }

    public async createCredential(credential: Credential): Promise<void> {
        const context = await this._databaseContext.getContext();

        const dbPassword = new DbPassword(credential.password.value);
        const dbCredential = new DbCredential(credential.credentialName, credential.username, dbPassword);

        await context.persist(dbCredential).flush();
    }

    public async getCredentialNames(): Promise<Credential[]> {
        const context = await this._databaseContext.getContext();

        const dbCredentials = (await context.findAll(DbCredential, {
            populate: ['password.value']
        }));

        const credentials: Array<Credential> = new Array<Credential>(dbCredentials.length);

        for (let index = 0; index < dbCredentials.length; index++) {
            const username = dbCredentials[index].username;
            const password = dbCredentials[index].password;
            const credentialName = dbCredentials[index].credentialName;
            const id = dbCredentials[index].id;

            const [_, credential] = Credential.Create(id, credentialName, username, password.value);

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
        const [_, credential] = Credential.Create(dbCredential.id, dbCredential.credentialName, dbCredential.username, dbCredential.password.value);

        return credential;
    }

    public async deleteCredentialById(credentialId: number): Promise<[boolean, string]> {
        const context = await this._databaseContext.getContext();

        const dbCredential = await context.findOne(DbCredential, credentialId);

        if (!dbCredential) {
            return [false, "Credential not found"];
        }

        await context.removeAndFlush([dbCredential]);
        //await context.nativeDelete(DbCredential, { id: credentialId });
        return [true, "Success"];
    }
}