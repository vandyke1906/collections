import Realm from "realm";

export class CollectionDetails extends Realm.Object {
    static schema = {
        name: 'collections_details',
        embedded: true,
        properties: {
            customerCode: 'string?',
            customerName: 'string?',
            invoiceNo: 'string?',
        }
    };
};