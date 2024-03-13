import Realm from "realm";

export class Group extends Realm.Object {
    static schema = {
        name: "groups",
        primaryKey: "_id",
        properties: {
            _id: "string"
        },
    };
}