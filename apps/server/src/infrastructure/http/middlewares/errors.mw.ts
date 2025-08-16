import { Request, Response, NextFunction } from 'express';
import { log } from '../../../utils/log.js';

export const badPathHandler = (req: Request, res: Response) => {
    log(`Bad path: ${req.url}`, 'error');
    res.status(404).send("404 - Not Found");
}

export const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction) => {
    log(`Error: ${err.message}`, 'error');
    res.status(500).json({ error: err.message });
    next(err);
}