import { getAllPlayerCampaigns } from "../../infrastructure/db/adapters/campaignRepoAdapter.js";

export const getPlayerCampaigns = async (playerId: number) => {
    return getAllPlayerCampaigns(playerId);
};
