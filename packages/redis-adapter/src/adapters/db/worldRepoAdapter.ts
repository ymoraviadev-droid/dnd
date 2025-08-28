import { db } from "./dbClient.js";

export async function createWorld(row: any) {
    return db.call<any>('db:req', {
        repo: 'world',
        action: 'create',
        data: row
    });
}
