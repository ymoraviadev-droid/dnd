import { connectToDb } from "./infrastructure/db.js";

await connectToDb().catch(() => {
    process.exit(1);
});
