import moment from "moment";
import Realm, { BSON } from "realm";
import { v4 } from "uuid";

export class SalesInvoice extends Realm.Object {
    static schema = {
        name: "salesInvoices",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => v4() },
            dateOfSI: { type: "int", indexed: true },
            invoiceNo: "string",
            dateDelivered: { type: "int", indexed: true },
            poNo: "string",
            soNo: "string",
            totalAmount: "double",
            unpaidAmount: "double",
            customerId: "string",
            customerName: "string",
            products: "salesProducts[]",
            dateCreated: { type: "int", default: () => moment().valueOf() },
        },
    };
}