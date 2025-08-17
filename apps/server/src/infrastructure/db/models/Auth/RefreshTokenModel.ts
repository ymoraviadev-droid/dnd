// infrastructure/db/models/Auth/RefreshTokenModel.ts
import { Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Entity } from "../Common/Entity.js";
import { UserModel } from "./UserModel.js";

@Table({
    tableName: "refresh_tokens",
    timestamps: true,
    indexes: [
        { name: "uniq_one_rt_per_user", unique: true, fields: ["userId"] },
        { name: "uniq_rt_token_hash", unique: true, fields: ["tokenHash"] },
    ],
})
export class RefreshTokenModel extends Entity {
    @ForeignKey(() => UserModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare userId: number;

    @BelongsTo(() => UserModel, { onDelete: "CASCADE", hooks: true })
    declare user?: UserModel;

    @Column({ type: DataType.STRING, allowNull: false })
    declare tokenHash: string;

    @Column({ type: DataType.DATE, allowNull: false }) declare issuedAt: Date;
    @Column({ type: DataType.DATE, allowNull: false }) declare expiresAt: Date;
    @Column({ type: DataType.DATE, allowNull: true }) declare revokedAt: Date | null;
    @Column({ type: DataType.STRING, allowNull: true }) declare replacedByToken: string | null;
    @Column({ type: DataType.STRING, allowNull: true }) declare userAgent: string | null;
    @Column({ type: DataType.STRING, allowNull: true }) declare ip: string | null;
}
