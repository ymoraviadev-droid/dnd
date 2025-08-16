import { Router } from "express";
import { authRouter } from "./auth.routes.js";

const mainRouter = Router();

mainRouter.get("/ping", (_req, res) => {
    res.send("pong");
});

mainRouter.use("/auth", authRouter);

export { mainRouter };