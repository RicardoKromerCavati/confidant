import { Embedded, Entity, PrimaryKey, Property } from "@mikro-orm/libsql";
import { DbPassword } from "./dbPassword";

@Entity()
export class DbCredential {

    @PrimaryKey({ primary: true, autoincrement: true, default: 1 })
    id!: number;

    @Property()
    credentialName: string;

    @Property()
    username: string;

    @Embedded()
    password: DbPassword;

    constructor(credentialName: string, username: string, password: DbPassword) {
        this.credentialName = credentialName;
        this.username = username;
        this.password = password;
    }
}