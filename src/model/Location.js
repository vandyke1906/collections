import Realm from "realm";

export class Location extends Realm.Object {
    static schema = {
        name: "locations",
        primaryKey: "_id",
        properties: {
            _id: "string",
        },
    };
}