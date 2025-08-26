import { RepoName } from "./RepoName.js";

export type DbResponse<T = any> = {
    type: 'db.response';
    correlationId: string;
    ok: true;
    result: T;
    meta?: { durationMs: number; repo: RepoName; action: string; };
} | {
    type: 'db.response';
    correlationId: string;
    ok: false;
    error: { message: string; code?: string; details?: any; };
};
