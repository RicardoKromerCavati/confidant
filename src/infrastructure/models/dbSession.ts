import { Entity, PrimaryKey, Property } from "@mikro-orm/libsql";

@Entity()
export class DbSession {

    @PrimaryKey({ primary: true, autoincrement: true, default: 1 })
    id: number = 1;

    @Property()
    passwordHash: string;

    @Property()
    expiration: string;

    constructor(passwordHash: string, expiration: string) {
        this.passwordHash = passwordHash;
        this.expiration = expiration;
    }
}