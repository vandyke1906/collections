import moment from "moment";
import Realm from "realm";
import { randomUUID } from "expo-crypto";

export class SalesInvoice extends Realm.Object {
    static schema = {
        name: "salesInvoices",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => randomUUID() },
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
            createdAt: { type: "int", default: () => moment().valueOf() },
        },
    };
}