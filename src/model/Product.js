import Realm, { BSON } from "realm";

export class Product extends Realm.Object {
    static schema = {
        name: "products",
        primaryKey: "_id",
        properties: {
            _id: { type: "uuid", default: () => new BSON.UUID() },
            code: "string",
            name: { type: "string", indexed: 'full-text' },
            unit: "string",
            group: { type: "string", indexed: true, optional: true }
        },
    };
}