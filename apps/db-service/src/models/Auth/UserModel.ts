import { Table, Column, DataType, HasMany } from "sequelize-typescript";
import { IUser } from "@dnd/types";
import { Entity } from "../Common/Entity.js";
import { RefreshTokenModel } from "./RefreshTokenModel.js";

@Table({
    tableName: "users",
    timestamps: true,
})
export class UserModel extends Entity implements IUser {
    @Column({ type: DataType.STRING, allowNull: false })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare password: string;

    @HasMany(() => RefreshTokenModel, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
    })
    declare refreshTokens?: RefreshTokenModel[];
}
