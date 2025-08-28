import type { RequestHandler } from 'express';
import type { ZodSchema } from '@dnd/zod-schemas';
import { createLogger } from '@dnd/logger';

type Part = 'body' | 'query' | 'params' | 'headers';
const log = createLogger({ service: 'server' });

export const validate = (part: Part, schema: ZodSchema): RequestHandler => async (req, res, next) => {
    try {
        const parsed = await schema.parseAsync((req)[part]);
        (req as any)[part] = parsed;
        next();
    } catch (e: any) {
        log.error(`Validation error on ${req.method} ${req.url} - ${part}: ${JSON.stringify(e?.issues ?? e)}`);
        res.status(400).json({ error: 'ValidationError', issues: e?.issues ?? [] });
    }
};