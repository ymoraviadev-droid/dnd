import { Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { IRefreshToken } from "@dnd/types";
import { Entity } from "../Common/Entity.js";
import { UserModel } from "./UserModel.js";

@Table({
    tableName: "refresh_tokens",
    timestamps: true,
})
export class RefreshTokenModel extends Entity implements IRefreshToken {
    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare userId: number;

    @BelongsTo(() => UserModel, {
        onDelete: "CASCADE",
        hooks: true,
    })
    declare user?: UserModel;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare tokenHash: string;

    @Column({ type: DataType.DATE, allowNull: false })
    declare issuedAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    declare expiresAt: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    declare revokedAt: Date | null;

    @Column({ type: DataType.STRING, allowNull: true })
    declare replacedByToken: string | null;

    @Column({ type: DataType.STRING, allowNull: true })
    declare userAgent: string | null;

    @Column({ type: DataType.STRING, allowNull: true })
    declare ip: string | null;
}
