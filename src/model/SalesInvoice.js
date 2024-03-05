import Realm, { BSON } from "realm";

export class SalesInvoice extends Realm.Object {
    static schema = {
        name: "salesInvoices",
        primaryKey: "_id",
        properties: {
            _id: { type: "uuid", default: () => new BSON.UUID() },
            dateOfSI: { type: 'date', optional: true },
            dateDelivered: { type: 'date', optional: true },
            poNo: "string",
            soNo: "string",
            totalAmount: "double",
            products: { type: "linkingObjects", objectType: "salesProducts", property: "salesInvoice" }
        },
    };
}