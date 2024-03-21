import moment from "moment";
import Realm from "realm";
import { randomUUID } from "expo-crypto";

export class Collection extends Realm.Object {
    static schema = {
        name: "collections",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => randomUUID() },
            corNo: { type: "string", indexed: "full-text" },
            corDate: { type: "int", indexed: true },
            paymentDate: { type: "int", indexed: true },
            amount: "double",
            modeOfPayment: "string",
            chequeNo: "string?",
            chequeDate: "int?",
            salesInvoice: "salesInvoices",
            details: "collections_details",
            customerId: { type: "string", indexed: true },
            dateCreated: { type: "int", default: () => moment().valueOf() },
            location: { type: "string", indexed: true },
            userId: { type: "string", indexed: true, optional: true },
        },
    };
}