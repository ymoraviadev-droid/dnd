import { CampaignModel } from "../models/Game/CampaignModel.js";
import { BaseRepo } from "./Base.repo.js";

export class CampaignRepo extends BaseRepo<CampaignModel> {
    constructor() {
        super(CampaignModel);
    }
}

export const campaignRepo = new CampaignRepo();
