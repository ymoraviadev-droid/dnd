import { StreamRpcClient, toAnyRedis } from '@dnd/rpc-client';
import { createClient } from 'redis';

const base = createClient({ url: process.env.REDIS_URL });
export const authClient = new StreamRpcClient(toAnyRedis(base), 'gateway-api');
export const authReady = authClient.init();

