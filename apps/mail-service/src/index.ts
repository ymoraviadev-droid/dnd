import { initialize } from "./infrastructure/consumer.js";
import { createLogger } from '@dnd/logger';

const log = createLogger({ service: 'mail-service' });
log.patchConsole();

(async () => {
    const stop = await initialize();

    const shutdown = async (sig: string) => {
        log.error(`${sig} received. shutting down mail-service...`);
        try { await stop?.(); } catch { }
        process.exit(0);
    };
    ['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig as NodeJS.Signals, () => shutdown(sig)));
})();
