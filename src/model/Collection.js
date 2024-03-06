import Realm, { BSON } from "realm";

export class Collection extends Realm.Object {
    static schema = {
        name: "collections",
        primaryKey: "_id",
        properties: {
            _id: { type: "uuid", default: () => new BSON.UUID() },
            corNo: "string",
            corDate: "int",
            paymentDate: { type: "int", indexed: true },
            amount: "double",
            modeOfPayment: "string",
            salesInvoice: "salesInvoices"
        },
    };
}