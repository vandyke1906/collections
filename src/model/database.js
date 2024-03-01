import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';
import schema from "../model/schema";
import migrations from "../model/migrations";

const adapter = new SQLiteAdapter({
    schema,
    migrations,
    jsi: true,
    onSetUpError: error => {
        console.error({ error });
    }
});

const database = new Database({
    adapter,
    modelClasses: [
    ],
});
