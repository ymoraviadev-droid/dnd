import {
    Table, Column, DataType, HasOne, Default, AllowNull
} from "sequelize-typescript";
import { Entity } from "../Common/Entity.js";
import { WorldModel } from "./WorldModel.js";

export type CampaignStatus = "draft" | "waiting" | "active" | "paused_afk" | "ended";

@Table({ tableName: "campaigns", timestamps: true })
export class CampaignModel extends Entity {
    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    declare ownerId: number;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    declare leaderId: number;

    @AllowNull(false)
    @Default([])
    @Column(DataType.ARRAY(DataType.BIGINT))
    declare playerIds: number[];

    @Column(DataType.ARRAY(DataType.BIGINT))
    declare invitedIds?: number[];

    @AllowNull(false)
    @Default("waiting")
    @Column(DataType.ENUM("draft", "waiting", "active", "paused_afk", "ended"))
    declare status: CampaignStatus;

    // שמירת המטא של העולם כ-JSONB (seed/size/currentTile)
    @AllowNull(false)
    @Column(DataType.JSONB)
    declare world: {
        seed: string;
        size: { rows: number; cols: number };
        currentTile: { row: number; col: number };
    };

    @AllowNull(false)
    @Column(DataType.TEXT)
    declare main_prompt: string;

    @HasOne(() => WorldModel, {
        foreignKey: "campaignId",
        onDelete: "CASCADE",
        hooks: true,
    })
    declare worldDoc?: WorldModel;
}
