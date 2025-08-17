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
        { newRecord }: { newRecord: CreateRefreshAttrs },
    ): Promise<RefreshTokenModel> {
        const sequelize = RefreshTokenModel.sequelize!;
        console.log("🔄 Starting simple rotation process");

        try {
            const created = await sequelize.transaction(async (t) => {
                console.log("🚀 Transaction started");

                console.log("🧹 Deleting all tokens for user:", newRecord.userId);
                const deleteCount = await RefreshTokenModel.destroy({
                    where: { userId: newRecord.userId },
                    transaction: t
                });
                console.log("🗑️ Deleted", deleteCount, "tokens");

                console.log("🆕 Creating new token...");
                const row = await RefreshTokenModel.create(newRecord as any, {
                    transaction: t,
                });
                console.log("✅ New token created with ID:", row.id);
                return row;
            });

            console.log("✅ Transaction completed successfully");
            return created;

        } catch (error) {
            console.log("❌ Transaction failed:", error);
            throw error;
        }
    }
}

export const refreshTokenRepo = new RefreshTokenRepo();
