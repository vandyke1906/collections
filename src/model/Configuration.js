import moment from "moment";
import Realm from "realm";
import { randomUUID } from "expo-crypto";

export class Configuration extends Realm.Object {
    static schema = {
        name: "configurations",
        primaryKey: "_id",
        properties: {
            _id: { type: "string", default: () => randomUUID() },
            startOfYear: { type: "int", indexed: true },
            userId: { type: "string", indexed: true, optional: true },
        },
    };
}