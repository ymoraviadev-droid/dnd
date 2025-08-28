import { initialize } from "./infrastructure/consumer.js";
import { dbReady } from "./infrastructure/dbClient.js";
import { createLogger } from "@dnd/logger";

const log = createLogger({ service: "auth-service" });

(async () => {
    await dbReady;
    const stop = await initialize();

    const shutdown = async (sig: string) => {
        log.info(`${sig} received. shutting down auth-service...`);
        try { await stop?.(); } catch { }
        process.exit(0);
    };
    ['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig as NodeJS.Signals, () => shutdown(sig)));
})();
