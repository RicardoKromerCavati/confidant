import path from 'node:path';
import * as os from 'os';
import { Session } from '../../application/sessions/session';
import { DbSession as DbSession } from '../models/dbSession';
import { DatabaseContext } from '../databaseContext';
import { injectable, inject } from "tsyringe";
import { wrap } from '@mikro-orm/core';

@injectable()
export class SessionRepository {

    private _databaseContext: DatabaseContext;

    constructor(@inject(DatabaseContext) databaseContext: DatabaseContext) {
        this._databaseContext = databaseContext;
    }

    private _databaseFilePath = path.join(os.homedir(), 'confidant', 'confidant2.db');

    public async InsertSession(session: Session): Promise<void> {

        const context = await this._databaseContext.getContext();

        const dbSession = new DbSession(session.masterPassword, session.expirationDate);

        await context.persist(dbSession).flush();
    }

    public async UpdateSession(dbSession: DbSession): Promise<void> {
        const context = await this._databaseContext.getContext();
        context.nativeUpdate(DbSession, { id: 1 }, { expiration: dbSession.expiration });
        context.flush();

        const user = await context.findOne(DbSession, { id: 1 });
    }

    public async GetSession(): Promise<DbSession | null> {
        const context = await this._databaseContext.getContext();

        return await context.findOne(DbSession, 1);
    }
}