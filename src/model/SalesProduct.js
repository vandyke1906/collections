import Realm from "realm";
import { v4 } from "uuid";

export class SalesProduct extends Realm.Object {
    static schema = {
        name: "salesProducts",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => v4() },
            productId: "string",
            code: "string",
            name: "string",
            unit: "string",
            qty: "int",
            amount: "double"
        },
    };
}