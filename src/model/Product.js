import Realm, { BSON } from "realm";
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
            group: { type: "string", indexed: true, optional: true }
        },
    };
}