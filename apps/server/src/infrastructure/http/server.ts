import express from "express";
import cors from "cors";
import { env } from "@dnd/env";
import { log } from "../../utils/log.js";
import { badPathHandler, errorHandler } from "./middlewares/errors.mw.js";
import { morganLogger } from "./middlewares/morganLogger.mw.js";
import { mainRouter } from "./routes/main.routes.js";

export const startServer = async () => {
    const app = express();

    // middleware
    app.use(cors());
    app.use(express.json());
    app.use(morganLogger);

    // routes
    app.use(mainRouter);

    // error handling middlewares
    app.use(badPathHandler);
    app.use(errorHandler);

    // start server
    app.listen(env.PORT, () => {
        log(`Server running on http://localhost:${env.PORT}`, "secondary");
    });
}
