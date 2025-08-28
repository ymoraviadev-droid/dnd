import { db } from "./dbClient.js";

export async function getUserById(userId: number) {
    return db.call<any>('db:req', {
        repo: 'user',
        action: 'findById',
        data: { id: userId }
    });
}

export async function getUserByEmail(email: string) {
    return db.call<any>('db:req', {
        repo: 'user',
        action: 'findOne',
        where: { email }
    });
}

// refreshTokenAdapter.ts
export async function getRefreshTokenRow(userId: number) {
    return db.call<any>('db:req', {
        repo: 'refreshToken',
        action: 'findOne',
        where: { userId }
    });
}

export async function updateRefreshTokenByUserId(userId: number, patch: any) {
    return db.call<number>('db:req', {
        repo: 'refreshToken',
        action: 'update',
        where: { userId },
        patch
    });
}

export async function deleteRefreshTokenByUserId(userId: number) {
    return db.call<number>('db:req', {
        repo: 'refreshToken',
        action: 'delete',
        where: { userId }
    });
}

export async function createUser(userData: any) {
    return db.call<any>('db:req', {
        repo: 'user',
        action: 'create',
        data: userData
    });
}

export async function findRefreshTokenByHash(tokenHash: string) {
    return db.call<any>("db:req", {
        repo: "refreshToken",
        action: "findOne",
        where: { tokenHash }
    });
};

export async function findRefreshTokenByUserId(userId: number) {
    return db.call<any>('db:req', {
        repo: 'refreshToken',
        action: 'findOne',
        where: { userId }
    });
};

export async function revokeRefreshTokenByHash(tokenHash: string, replacedByToken: string | null) {
    return db.call<number>("db:req", {
        repo: "refreshToken",
        action: "update",
        where: { tokenHash },
        patch: { revokedAt: new Date(), replacedByToken }
    });
}

export async function createRefreshToken(rowData: {
    userId: number;
    tokenHash: string;
    issuedAt: Date;
    expiresAt: Date;
    userAgent: string | null;
    ip: string | null;
    replacedByToken: string | null;
    revokedAt?: Date | null;
}) {
    return db.call<any>("db:req", {
        repo: "refreshToken",
        action: "create",
        data: rowData
    });
}