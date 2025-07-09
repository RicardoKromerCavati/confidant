import { Entity, PrimaryKey, Property } from "@mikro-orm/libsql";

@Entity()
export class SessionDb {

    @PrimaryKey()
    id: number = 0;

    @Property()
    passwordHash: string;

    @Property()
    expiration: string;


    constructor(passwordHash: string, expiration: string) {
        this.passwordHash = passwordHash;
        this.expiration = expiration;
    }
}