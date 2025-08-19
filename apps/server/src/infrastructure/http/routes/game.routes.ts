
import { Router } from "express";
import { catchAsync } from "../middlewares/catchAsync.mw.js";
import { validate } from "../middlewares/validation.mw.js";
import { CreatePlayerSchema, CreateCampaignSchema } from "@dnd/zod-schemas";
import { createPlayer } from "../../../application/game-actions/createPlayer.js";
import { auth } from "../middlewares/auth.mw.js";
import { createCampaignAndWorld } from "../../../application/game-actions/createCampaign.js";

const gameRouter = Router();

gameRouter.post("/", auth, validate("body", CreatePlayerSchema), catchAsync(async (req, res) => {
    const player = req.body;
    const createdPlayer = await createPlayer(player, req.userId!);
    return res.status(200).json(createdPlayer);
}));

gameRouter.post("/campaign", auth, validate("body", CreateCampaignSchema), catchAsync(async (req, res) => {
    const { name, invitedIds } = req.body;
    const createdCampaign = await createCampaignAndWorld({
        name,
        ownerId: req.userId!,
        invitedIds
    });
    return res.status(200).json(createdCampaign);
}));

export { gameRouter };