import { Request, Response, NextFunction } from 'express';
import { createLogger } from '@dnd/logger';

const log = createLogger({ service: 'server' });

export const badPathHandler = (req: Request, res: Response) => {
    log.error(`Bad path: ${req.url}`);
    res.status(404).send("404 - Not Found");
}

export const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction) => {
    log.error(`Error: ${err.message}`);
    console.log(err.stack);
    res.status(500).json({ error: err.message });
    next(err);
};