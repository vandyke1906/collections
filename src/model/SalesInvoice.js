import Realm, { BSON } from "realm";

export class SalesInvoice extends Realm.Object {
    static schema = {
        name: "salesInvoices",
        primaryKey: "_id",
        properties: {
            _id: { type: "uuid", default: () => new BSON.UUID() },
            dateOfSI: "int?",
            invoiceNo: "string",
            dateDelivered: "int?",
            poNo: "string",
            soNo: "string",
            totalAmount: "double",
            unpaidAmount: "double",
            customerId: "uuid",
            customerName: "string",
            products: "salesProducts[]",
            dateCreated: "int?",
        },
    };
}