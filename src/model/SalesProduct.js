import Realm, { BSON } from "realm";

export class SalesProduct extends Realm.Object {
    static schema = {
        name: "salesProducts",
        primaryKey: "_id",
        properties: {
            _id: { type: "uuid", default: () => new BSON.UUID() },
            productId: "uuid",
            code: "string",
            name: "string",
            unit: "string",
            qty: "int",
            amount: "double",
            salesInvoice: "salesInvoices",
        },
    };
}