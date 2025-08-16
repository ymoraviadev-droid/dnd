import { DbRecord } from "../private/DbRecord.js";

export interface IRefreshToken extends DbRecord {
    userId: number;
    tokenHash: string;
    issuedAt: Date;
    expiresAt: Date;
    revokedAt: Date | null;
    replacedByToken: string | null;
    userAgent: string | null;
    ip: string | null;
}