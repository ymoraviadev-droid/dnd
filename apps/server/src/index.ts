import { authReady } from "./infrastructure/auth/authClient.js";
import { dbReady } from "./infrastructure/db/dbClient.js";
import { startServer } from "./infrastructure/http/server.js";
import { createLogger } from "@dnd/logger";

const log = createLogger({ service: "server" });

const main = async () => {
    try {
        await authReady;
        await dbReady;
        await startServer();
    } catch (err) {
        log.error("Failed to start server");
        process.exit(1);
    }
}

main();
