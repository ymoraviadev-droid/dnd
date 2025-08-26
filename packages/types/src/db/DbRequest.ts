// src/types/DbRequest.ts
import type { BaseActions } from './BaseActions.js';
import type { RepoName } from './RepoName.js';

export type DbRequest = {
    type?: 'db.request';
    repo: RepoName;
    action: BaseActions | 'custom';
    data?: any;
    where?: any;
    patch?: any;
    opts?: any;
    page?: number;
    pageSize?: number;
    customMethod?: string;
    params?: any;
    txId?: string | null;

    replyTo: string;
    correlationId: string;
    schema: 1;
    requestedBy?: string;
    timeoutMs?: number;

    __attempts?: number;
};
