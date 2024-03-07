import Realm from "realm";
import { randomUUID } from "expo-crypto";

export class SalesProduct extends Realm.Object {
    static schema = {
        name: "salesProducts",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => randomUUID() },
            productId: "string",
            code: "string",
            name: "string",
            unit: "string",
            qty: "int",
            amount: "double",
            group: "string"
        },
    };
}