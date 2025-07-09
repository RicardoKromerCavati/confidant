import path from 'node:path';
import promptSync from 'prompt-sync';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { Password } from '../../domain/models/password';
import { Session } from './session';
import { SessionRepository } from '../../infrastructure/repositories/sessionRepository';
import { injectable, inject } from "tsyringe";
import { DbSession } from '../../infrastructure/models/dbSession';

@injectable()
export class AuthenticationService {

    private _sessionRepository: SessionRepository;

    constructor(@inject(SessionRepository) sessionRepository: SessionRepository) {
        this._sessionRepository = sessionRepository;
    }

    public async validateSession(): Promise<boolean> {
        const dbSession: DbSession | null = await this._sessionRepository.GetSession();

        if (dbSession === null) {
            const masterPassword = await this.createMasterPassword();

            var session = new Session(masterPassword, moment().add(10, 'minutes').toISOString(true));

            await this._sessionRepository.InsertSession(session);

            return true;
        }

        return await this.validateSessionInformation(dbSession);
    }

    private async validateSessionInformation(dbSession: DbSession): Promise<boolean> {
        if (!moment().isAfter(dbSession.expiration)) {
            return true;
        }

        console.log('Session expired');

        const prompt = promptSync({ sigint: true });

        const masterPassword = prompt('Please re enter your password: ', { echo: '*' });

        if (await bcrypt.compare(masterPassword, dbSession.passwordHash)) {

            dbSession.expiration = moment().add(10, 'minutes').toISOString(true);

            await this._sessionRepository.UpdateSession(dbSession);

            return true;
        }

        console.log('Invalid master password');

        return false;
    }

    private async createMasterPassword(): Promise<string> {
        console.log('I see you haven\'t logged in yet!');

        var masterPasswordFirstAttempt = 'firstAttempt';
        var masterPasswordSecondAttempt = 'secondAttempt';

        while (masterPasswordFirstAttempt !== masterPasswordSecondAttempt) {
            const prompt = promptSync({ sigint: true });

            try {
                masterPasswordFirstAttempt = prompt('Create a master password: ', { echo: '*' });
                masterPasswordSecondAttempt = prompt('Please re enter your password: ', { echo: '*' });
            } catch {
                process.exit(1);
            }

            if (masterPasswordFirstAttempt !== masterPasswordSecondAttempt) {
                console.log('Passwords must match!');
                continue;
            }

            const passwordResult = Password.CreatePassword(masterPasswordFirstAttempt);

            if (!passwordResult.isSuccessful) {
                console.log(passwordResult.message);
                masterPasswordFirstAttempt = 'firstAttempt';
                masterPasswordSecondAttempt = 'secondAttempt';
                continue;
            }

            break;
        }

        return bcrypt.hashSync(masterPasswordFirstAttempt, 0);
    }
}
