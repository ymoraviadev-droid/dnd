import { CreateCampaignRow } from "../../../types/CreateCampaignTypes.js";
import { db } from "../dbClient.js";

export async function createCampaign(data: CreateCampaignRow) {
    return db.call<any>('db:req', {
        repo: 'campaign',
        action: 'create',
        data
    });
}

export async function removeCampaignById(id: number) {
    return db.call<number>('db:req', {
        repo: 'campaign',
        action: 'remove',
        where: { id }
    });
}

export async function getAllPlayerCampaigns(playerId: number) {
    return db.call<any[]>('db:req', {
        repo: 'campaign',
        action: 'custom',
        customMethod: 'getAllPlayerCampaigns',
        params: { playerId }
    });
}
