// db/models/WorldModel.ts
import {
    Table, Column, DataType, ForeignKey, BelongsTo, AllowNull, Unique
} from "sequelize-typescript";
import { Entity } from "../Common/Entity.js";
import { CampaignModel } from "./CampaignModel.js";

@Table({ tableName: "worlds", timestamps: true })
export class WorldModel extends Entity {
    @AllowNull(false)
    @ForeignKey(() => CampaignModel)
    @Unique // עולם אחד לכל קמפיין
    @Column(DataType.BIGINT)
    declare campaignId: number;

    // כל ה-IWorld כ-JSONB (tiles, rules וכו')
    @AllowNull(false)
    @Column(DataType.JSONB)
    declare data: unknown;

    @BelongsTo(() => CampaignModel)
    declare campaign?: CampaignModel;
}
