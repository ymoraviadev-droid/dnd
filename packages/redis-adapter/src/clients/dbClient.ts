// userRepoAdapter.ts
import { StreamRpcClient, toAnyRedis } from './rpcClient.js';
import { createClient } from 'redis';

const base = createClient({ url: process.env.REDIS_URL });
export const db = new StreamRpcClient(toAnyRedis(base), 'gateway-api');
export const dbReady = db.init();