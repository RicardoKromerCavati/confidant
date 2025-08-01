import { MikroORM } from '@mikro-orm/libsql';
import { injectable, singleton } from "tsyringe";

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
        this._orm = await MikroORM.init({
            entities: ['./src/infrastructure/models/*.ts'],
            dbName: 'confidant.db',
            password: 'samplePassword'
        });
    }
}