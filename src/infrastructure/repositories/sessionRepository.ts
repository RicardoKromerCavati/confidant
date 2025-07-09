import path from 'node:path';
import * as os from 'os';
import { Session } from '../../application/sessions/session';
import { SessionDb as DbSession } from '../models/dbSession';
import { DatabaseContext } from '../databaseContext';
import { injectable, inject } from "tsyringe";

@injectable()
export class SessionRepository {

    private _databaseContext: DatabaseContext;

    constructor(@inject(DatabaseContext) databaseContext : DatabaseContext) {
        this._databaseContext = databaseContext;
    }

    private _databaseFilePath = path.join(os.homedir(), 'confidant', 'confidant2.db');

    public async CreateSession(session: Session): Promise<void> {

        const context = await this._databaseContext.getContext();

        const dbSession = new DbSession(session.masterPassword, session.expirationDate);

        await context.persist(dbSession).flush();
    }
}