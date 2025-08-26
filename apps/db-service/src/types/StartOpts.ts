export type StartOpts = {
    redisUrl?: string;
    stream?: string;     // default 'db:req'
    group?: string;      // default 'db:service'
    dlq?: string;        // default 'db:dlq'
    idleMs?: number;     // XAUTOCLAIM idle threshold, default 30s
};
