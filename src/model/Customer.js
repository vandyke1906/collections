import Realm, { BSON } from "realm";
import { v4 } from "uuid";

export class Customer extends Realm.Object {
    static schema = {
        name: "customers",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => v4() },
            code: "string?",
            name: { type: "string", indexed: "full-text" },
            address: "string"
        },
    };
}