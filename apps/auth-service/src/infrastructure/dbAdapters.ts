import { db } from "./dbClient.js";

export const getUserById = (id: number) =>
    db.call<any>('db:req', { repo: 'user', action: 'findById', data: { id } });

export const getUserByEmail = (email: string) =>
    db.call<any>('db:req', { repo: 'user', action: 'findOne', where: { email } });

export const findRefreshTokenByHash = (tokenHash: string) =>
    db.call<any>('db:req', { repo: 'refreshToken', action: 'findOne', where: { tokenHash } });

export const findRefreshTokenByUserId = (userId: number) =>
    db.call<any>('db:req', { repo: 'refreshToken', action: 'findOne', where: { userId } });

export const updateRefreshTokenByUserId = (userId: number, patch: any) =>
    db.call<number>('db:req', { repo: 'refreshToken', action: 'update', where: { userId }, patch });

export const createRefreshToken = (row: any) =>
    db.call<any>('db:req', { repo: 'refreshToken', action: 'create', data: row });

export const revokeRefreshTokenByHash = (tokenHash: string, replacedByToken: string | null) =>
    db.call<number>('db:req', {
        repo: 'refreshToken',
        action: 'update',
        where: { tokenHash },
        patch: { revokedAt: new Date(), replacedByToken }
    });
