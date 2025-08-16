import chalk from "chalk";
import { LogTypes } from "../types/LogTypes.js";

export const log = (message: string, type: LogTypes) => {
    const dictionary = {
        error: chalk.bold.red,
        success: chalk.bold.green,
        info: chalk.bold.blue,
        warning: chalk.bold.yellow,
        secondary: chalk.bold.magentaBright,
        standard: chalk.bold.white
    };

    const color = type ? dictionary[type] : dictionary.standard;

    console.log(color(message));
};