import morgan, { TokenIndexer } from 'morgan';
import { Request, Response } from 'express';
import chalk from 'chalk';
import { DateTime } from 'luxon';
import { MorganConsoleLogFormat } from '../types/MorganConsoleLogFormat.js';

const consoleFormat = (tokens: TokenIndexer, req: Request, res: Response) => {
    const color = res.statusCode >= 400 ? chalk.red : chalk.green;

    return [
        chalk.cyan(DateTime.now().toFormat('dd LLL yyyy')),
        chalk.cyan(DateTime.now().toFormat('HH:mm:ss')),
        color(tokens.method(req, res)),
        color(tokens.url(req, res)),
        color(tokens.status(req, res)),
        tokens['response-time'](req, res) + 'ms',
    ].join(' | ');
};

const consoleLogger = morgan(consoleFormat as MorganConsoleLogFormat);

export const morganLogger = (req: Request, res: Response, next: Function) => {
    consoleLogger(req, res, () => {
        next();
    });
};
