// services/auth/src/db.ts
import { StreamRpcClient } from '@dnd/rpc-client';
import { createClient } from 'redis';

export const db = new StreamRpcClient(createClient({ url: process.env.REDIS_URL }), 'auth-service');
export const dbReady = db.init();
