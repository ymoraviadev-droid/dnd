// src/index.ts
import { createLogger } from '@dnd/logger';
import { connectToDb } from './infrastructure/db.js';
import { startConsumer } from './infrastructure/consumer.js';

const log = createLogger({ service: 'db-service' });
log.patchConsole();

(async () => {
    await connectToDb();
    const stop = await startConsumer({ redisUrl: process.env.REDIS_URL });
    log.success('DB-Service is up and running');

    const shutdown = async (sig: string) => {
        console.log(`\n${sig} received. Shutting down...`);
        try { await stop(); } catch { }
        // optionally close sequelize
        const { sequelize } = await import('./infrastructure/db.js');
        try { await sequelize.close(); } catch { }
        process.exit(0);
    };

    ['SIGINT', 'SIGTERM'].forEach(s => process.on(s as NodeJS.Signals, () => shutdown(s)));
})();
