import { db } from "../../clients/dbClient.js";

export async function createPlayerRow(data: any) {
    return db.call<any>('db:req', {
        repo: 'player',
        action: 'create',
        data
    });
}

export async function getPlayersByUserId(userId: number) {
    return db.call<any[]>('db:req', {
        repo: 'player',
        action: 'custom',
        customMethod: 'findAllByUserId',
        params: { userId }
    });
}
