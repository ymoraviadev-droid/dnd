import { campaignRepo } from "../../infrastructure/db/repositories/Campaign.repo.js";

export const getPlayerCampaigns = async (playerId: number) => {
    return campaignRepo.getAllPlayerCampaigns(playerId);
};
