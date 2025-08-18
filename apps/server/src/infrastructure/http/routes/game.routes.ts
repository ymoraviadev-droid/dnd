
import { Router } from "express";
import { catchAsync } from "../middlewares/catchAsync.mw.js";
import { validate } from "../middlewares/validation.mw.js";
import { CreatePlayerSchema } from "@dnd/zod-schemas";
import { createPlayer } from "../../../application/game-actions/createPlayer.js";
import { auth } from "../middlewares/auth.mw.js";

const gameRouter = Router();

gameRouter.post("/", validate("body", CreatePlayerSchema), auth, catchAsync(async (req, res) => {
    const player = req.body;
    const createdPlayer = await createPlayer(player, req.userId!);
    return res.status(200).json(createdPlayer);
}));

export { gameRouter };