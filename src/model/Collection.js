import moment from "moment";
import Realm from "realm";
import { v4 } from "uuid";

export class Collection extends Realm.Object {
    static schema = {
        name: "collections",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => v4() },
            corNo: { type: "string", indexed: "full-text" },
            corDate: { type: "int", indexed: true },
            paymentDate: { type: "int", indexed: true },
            amount: "double",
            modeOfPayment: "string",
            salesInvoice: "salesInvoices",
            details: 'collections_details',
            customerId: { type: "string", indexed: true },
            dateCreated: { type: "int", default: () => moment().valueOf() },
        },
    };
}