import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { gameRouter } from "./game.routes.js";

const mainRouter = Router();

mainRouter.get("/ping", (_req, res) => {
    res.send("pong");
});

mainRouter.use("/auth", authRouter);
mainRouter.use("/game", gameRouter);

export { mainRouter };