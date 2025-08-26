// userRepoAdapter.ts
import { db } from '../dbClient.js';
import { CreatePlayerBody } from '@dnd/zod-schemas';

export async function createPlayerRow(data: CreatePlayerBody) {
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
