import { LogTypes } from "../types/LogTypes.js";

export const levelOrder: Record<LogTypes, number> = {
    error: 50,
    warning: 40,
    info: 30,
    success: 25,
    secondary: 20,
    standard: 10,
};