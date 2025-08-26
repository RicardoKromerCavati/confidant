import { MikroORM } from '@mikro-orm/libsql';
import { injectable, singleton } from "tsyringe";
import path from 'path';
import * as os from 'os';

@injectable()
@singleton()
export class DatabaseContext {

    private _orm!: MikroORM;

    public async initializeDatabase(): Promise<void> {
        await this.create();
        await this._orm.schema.ensureDatabase();
        await this._orm.schema.updateSchema();
    }

    public async getContext() {
        return this._orm.em.fork();
    }

    private async create() {
        const rootDir = __dirname.includes('dist') ? 'dist' : 'src';
        //console.log(rootDir);
        const databaseEntitiesPath = path.resolve(__dirname, '..', '..', rootDir, 'src', 'infrastructure', 'models', '**', '*.{ts,js}');
        const databaseFilePath = path.join(os.homedir(), 'confidant', 'confidant.db');

        this._orm = await MikroORM.init({
            entities: [databaseEntitiesPath],
            dbName: databaseFilePath,
            password: 'samplePassword'
        });
    }
}