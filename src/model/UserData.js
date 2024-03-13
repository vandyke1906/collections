import Realm from "realm";

export class UserData extends Realm.Object {
    static schema = {
        name: "userData",
        primaryKey: "_id",
        properties: {
            _id: "string",
            location: "string",
            userId: { type: "string", indexed: true }
        },
    };
}