import { db } from '../dbClient.js';
import { CreateWorldRow } from '../../../types/CreateCampaignTypes.js';

export async function createWorld(row: CreateWorldRow) {
    return db.call<any>('db:req', {
        repo: 'world',
        action: 'create',
        data: row
    });
}
