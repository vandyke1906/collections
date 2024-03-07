import Realm, { BSON } from "realm";
import { randomUUID } from "expo-crypto";

export class Customer extends Realm.Object {
    static schema = {
        name: "customers",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => randomUUID() },
            code: "string?",
            name: { type: "string", indexed: "full-text" },
            address: "string"
        },
    };
}