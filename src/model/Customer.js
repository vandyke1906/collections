import Realm, { BSON } from "realm";

export class Customer extends Realm.Object {
    static schema = {
        name: "customers",
        primaryKey: "_id",
        properties: {
            _id: { type: "uuid", default: () => new BSON.UUID() },
            code: "string?",
            name: { type: "string", indexed: "full-text" },
            address: "string"
        },
    };
}