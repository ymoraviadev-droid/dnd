import chalk from "chalk";
import { LogTypes } from "../types/LogTypes.js";

export const variants: Record<LogTypes, (s: string) => string> = {
    error: chalk.bold.red,
    warning: chalk.bold.yellow,
    info: chalk.bold.blue,
    success: chalk.bold.green,
    secondary: chalk.bold.magentaBright,
    standard: chalk.bold.white,
};
