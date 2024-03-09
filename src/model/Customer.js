import Realm from "realm";
import { randomUUID } from "expo-crypto";

export class Customer extends Realm.Object {
    static schema = {
        name: "customers",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => randomUUID() },
            code: "string?",
            name: { type: "string", indexed: "full-text" },
            address: "string",
            deletedAt: { type: "int", default: () => 0, indexed: true },
            indexedName: { type: "string", indexed: true },
        },
    };
}