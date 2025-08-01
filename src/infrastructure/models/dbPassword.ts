import { Embeddable, PrimaryKey, Property } from "@mikro-orm/libsql";

@Embeddable()
export class DbPassword {
    @Property()
    value: string;

    constructor(value: string) {
        this.value = value;
    }
}