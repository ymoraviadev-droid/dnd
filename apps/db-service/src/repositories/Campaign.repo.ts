import { CampaignModel } from "../models/Game/CampaignModel.js";
import { BaseRepo } from "./Base.repo.js";
import { Op } from "sequelize";

export class CampaignRepo extends BaseRepo<CampaignModel> {
    constructor() {
        super(CampaignModel);
    }

    getAllPlayerCampaigns(playerId: number) {
        return CampaignModel.findAll({
            where: {
                [Op.or]: [
                    { leaderId: playerId },
                    { playerIds: { [Op.contains]: [playerId] } },
                    { invitedIds: { [Op.contains]: [playerId] } }
                ]
            }
        });
    }
}

export const campaignRepo = new CampaignRepo();