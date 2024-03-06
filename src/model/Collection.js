import moment from "moment";
import Realm from "realm";
import { v4 } from "uuid";

export class Collection extends Realm.Object {
    static schema = {
        name: "collections",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => v4() },
            corNo: "string",
            corDate: "int",
            paymentDate: { type: "int", indexed: true },
            amount: "double",
            modeOfPayment: "string",
            salesInvoice: "salesInvoices",
            dateCreated: { type: "int", default: () => moment().valueOf() },
        },
    };
}