import { getAllPlayerCampaigns } from "@dnd/redis-adapter";

export const getPlayerCampaigns = async (playerId: number) => {
    return getAllPlayerCampaigns(playerId);
};
