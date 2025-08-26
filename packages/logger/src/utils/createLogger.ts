import chalk from "chalk";
import { DateTime } from "luxon";
import { levelOrder } from "../enums/levelOrder.js";
import { variants } from "../enums/variants.js";
import { CreateLoggerOptions } from "../types/CreateLoggerOptions.js";
import { LogTypes, LogMeta } from "../types/LogTypes.js";
import { writeJson } from "./writeJson.js";

export const createLogger = (opts: CreateLoggerOptions) => {
    const { service, forceJson } = opts;
    const isProd =
        process.env.NODE_ENV === "production" || process.env.DOCKER === "true";

    const emit = (type: LogTypes, message: string, meta?: LogMeta) => {
        const ts = DateTime.now().toISO(); // same timestamp you used

        // Decide output mode:
        // - prod or forceJson => JSON only (stdout)
        // - otherwise (dev + TTY) => pretty only (stdout)
        const jsonOnly = forceJson || isProd || !process.stdout.isTTY;

        if (jsonOnly) {
            // Structured JSON for Docker / collectors
            writeJson({
                ts,
                service,
                level: type,
                lvl: levelOrder[type],
                msg: message,
                ...meta,
            });
            return;
        }

        // Pretty line for local dev
        const color = variants[type] ?? variants.standard;
        const tag = chalk.gray(`[${service}]`);
        const time = chalk.gray(ts);
        const metaSummary =
            meta && Object.keys(meta).length ? chalk.dim(` ${JSON.stringify(meta)}`) : "";
        // print to STDOUT (so you only see one line)
        process.stdout.write(`${time} ${tag} ${color(message)}${metaSummary}\n`);
    };

    return {
        log: (msg: string, type: LogTypes = "standard", meta?: LogMeta) =>
            emit(type, msg, meta),

        error: (msg: string, meta?: LogMeta) => emit("error", msg, meta),
        warn: (msg: string, meta?: LogMeta) => emit("warning", msg, meta),
        info: (msg: string, meta?: LogMeta) => emit("info", msg, meta),
        success: (msg: string, meta?: LogMeta) => emit("success", msg, meta),
        sec: (msg: string, meta?: LogMeta) => emit("secondary", msg, meta),
        std: (msg: string, meta?: LogMeta) => emit("standard", msg, meta),

        /**
         * Patch global console.* so any console output is also structured.
         * Call once at service startup.
         */
        patchConsole() {
            const self = this;

            const wrap =
                (type: LogTypes) =>
                    (...args: any[]) => {
                        const msg = args
                            .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
                            .join(" ");
                        self.log(msg, type);
                    };

            console.log = wrap("standard") as any;
            console.info = wrap("info") as any;
            console.warn = wrap("warning") as any;
            console.error = wrap("error") as any;
        },
    };
}
