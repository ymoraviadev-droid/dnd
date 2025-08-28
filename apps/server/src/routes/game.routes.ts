
import { Router } from "express";
import { catchAsync } from "../middlewares/catchAsync.mw.js";
import { validate } from "../middlewares/validation.mw.js";
import { CreatePlayerSchema, CreateCampaignSchema } from "@dnd/zod-schemas";
import { createPlayer } from "../actions/game-actions/createPlayer.js";
import { auth } from "../middlewares/auth.mw.js";
import { createCampaignAndWorld } from "../actions/game-actions/createCampaign.js";
import { getPlayerCampaigns } from "../actions/game-actions/getPlayerCampains.js";

const gameRouter = Router();

gameRouter.post("/", auth, validate("body", CreatePlayerSchema), catchAsync(async (req, res) => {
    const player = req.body;
    const createdPlayer = await createPlayer(player, req.userId!);
    res.header("Location", `/game/${createdPlayer.id}`);
    return res.status(201).json(createdPlayer);
}));

gameRouter.post("/campaign/:playerId", auth, validate("body", CreateCampaignSchema), catchAsync(async (req, res) => {
    const { name, invitedIds } = req.body;
    const playerId = Number(req.params.playerId);
    const createdCampaign = await createCampaignAndWorld({
        name,
        ownerId: playerId,
        invitedIds
    });
    res.header("Location", `/game/campaigns/${createdCampaign.campaign.id}`);
    return res.status(201).json(createdCampaign);
}));

gameRouter.get("/campaigns/:playerId", auth, catchAsync(async (req, res) => {
    const campaigns = await getPlayerCampaigns(Number(req.params.playerId));
    return res.status(200).json(campaigns);
}));

export { gameRouter };