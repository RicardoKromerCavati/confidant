import { Entity, PrimaryKey, Property } from "@mikro-orm/libsql";
import { Password } from "../../domain/models/password";

@Entity()
export class DbCredential {

    @PrimaryKey({ primary: true, autoincrement: true, default: 1 })
    id: number = 1;

    @Property()
    credentialName: string;

    @Property()
    username: string;

    @Property()
    password: Password;

    constructor(credentialName: string, username: string, password: Password) {
        this.credentialName = credentialName;
        this.username = username;
        this.password = password;
    }
}