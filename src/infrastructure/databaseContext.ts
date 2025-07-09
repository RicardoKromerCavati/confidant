import path from 'node:path';
import * as os from 'os';
import { MikroORM } from '@mikro-orm/libsql';
import { injectable } from "tsyringe";

@injectable()
export class DatabaseContext {
    private _databaseFilePath = path.join(os.homedir(), 'confidant', 'confidant2.db');

    public async initializeDatabase(): Promise<void> {
        const orm = await this.create();
        await orm.schema.ensureDatabase();
        await orm.schema.updateSchema();
    }

    public async getContext() {
        return (await this.create()).em.fork();
    }

    private async create() {
        return await MikroORM.init({
            entities: ['./src/infrastructure/models/*.ts'],
            dbName: 'confidant.db',
            password: 'samplePassword'
        });
    }
}