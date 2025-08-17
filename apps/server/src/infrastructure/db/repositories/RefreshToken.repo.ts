import {
    CreationAttributes,
    Transaction,
    UniqueConstraintError,
} from "sequelize";
import { BaseRepo } from "./Base.repo.js";
import { RefreshTokenModel } from "../models/Auth/RefreshTokenModel.js";

type CreateRefreshAttrs = Omit<
    CreationAttributes<RefreshTokenModel>,
    "id" | "createdAt" | "updatedAt"
>;

export class RefreshTokenRepo extends BaseRepo<RefreshTokenModel> {
    constructor() {
        super(RefreshTokenModel);
    }

    findByHash(hash: string) {
        return this.findOne({ tokenHash: hash });
    }

    findByIp(ip: string) {
        return this.findOne({ ip });
    }

    async rotate(
        {
            oldHash,
            newRecord,
        }: { oldHash: string; newRecord: CreateRefreshAttrs },
        tx?: Transaction
    ): Promise<RefreshTokenModel> {
        const sequelize = RefreshTokenModel.sequelize!;
        const created = await sequelize.transaction(
            { transaction: tx },
            async (t) => {
                const prev = await RefreshTokenModel.findOne({
                    where: { tokenHash: oldHash },
                    transaction: t,
                    lock: t.LOCK.UPDATE,
                });

                if (prev && !prev.revokedAt) {
                    await prev.update(
                        {
                            revokedAt: new Date(),
                            replacedByToken: newRecord.tokenHash,
                        } as Partial<RefreshTokenModel>,
                        { transaction: t }
                    );
                }

                try {
                    const row = await RefreshTokenModel.create(newRecord as any, {
                        transaction: t,
                    });
                    return row;
                } catch (e) {
                    if (e instanceof UniqueConstraintError) {
                        const existing = await RefreshTokenModel.findOne({
                            where: { tokenHash: newRecord.tokenHash },
                            transaction: t,
                        });
                        if (existing) return existing;
                    }
                    throw e;
                }
            }
        );

        return created;
    }
}

export const refreshTokenRepo = new RefreshTokenRepo();
