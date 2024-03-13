import Realm from "realm";
import { randomUUID } from "expo-crypto";

export class Product extends Realm.Object {
    static schema = {
        name: "products",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => randomUUID() },
            code: "string",
            name: { type: "string", indexed: "full-text" },
            unit: "string",
            group: { type: "string", indexed: true, optional: true },
            deletedAt: { type: "int", default: () => 0, indexed: true },
            indexedName: { type: "string", indexed: true }
        },
    };
}