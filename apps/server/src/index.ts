import { connectToDb } from "./infrastructure/db/db.js";
import { startServer } from "./infrastructure/http/server.js";
import { log } from "./utils/log.js";

const main = async () => {
    try {
        await connectToDb();
        await startServer();
    } catch (err) {
        log("Failed to start server", "error");
        process.exit(1);
    }
}

main();
