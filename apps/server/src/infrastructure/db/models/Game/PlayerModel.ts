import { Table, Column, DataType } from "sequelize-typescript";
import { IUser } from "@dnd/types";
import { Entity } from "../Common/Entity.js";

@Table({
    tableName: "players",
    timestamps: true,
})
export class PlayerModel extends Entity implements IUser {
    @Column({ type: DataType.STRING, allowNull: false })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare password: string;
}
