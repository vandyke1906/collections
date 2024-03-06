import Realm, { BSON } from "realm";
import { v4 } from "uuid";

export class Product extends Realm.Object {
    static schema = {
        name: "products",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => v4() },
            code: "string",
            name: { type: "string", indexed: "full-text" },
            unit: "string",
            group: { type: "string", indexed: true, optional: true }
        },
    };
}