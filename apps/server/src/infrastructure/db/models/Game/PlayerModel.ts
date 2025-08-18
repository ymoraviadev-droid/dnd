import {
    Table, Column, DataType, ForeignKey, BelongsTo, Index, Default, AllowNull
} from "sequelize-typescript";
import { Entity } from "../Common/Entity.js";
import { UserModel } from "../Auth/UserModel.js";
import type {
    IPlayer, PlayerRace, PlayerClass, PlayerAlignment,
    Zone,
    Condition,
    LifeStatus,
} from "@dnd/types";

const RACES: PlayerRace[] = ["human", "elf", "dwarf", "orc", "halfling", "gnome", "half-elf", "half-orc"];
const CLASSES: PlayerClass[] = ["Fighter", "Mage", "Thief", "Cleric"];
const ALIGNMENTS: PlayerAlignment[] = [
    "lawful-good", "neutral-good", "chaotic-good",
    "lawful-neutral", "true-neutral", "chaotic-neutral",
    "lawful-evil", "neutral-evil", "chaotic-evil",
];

@Table({
    tableName: "players",
    timestamps: true,
})
export class PlayerModel extends Entity implements IPlayer {
    // === Ownership ===
    @ForeignKey(() => UserModel)
    @Index("ix_players_userId")
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare userId: number;

    @BelongsTo(() => UserModel)
    declare user?: UserModel;

    // === Identity / Progression ===
    @AllowNull(false)
    @Column(DataType.STRING(64))
    declare name: string;

    @AllowNull(false)
    @Column(DataType.ENUM(...RACES))
    declare race: PlayerRace;

    @AllowNull(false)
    @Column(DataType.ENUM(...CLASSES))
    declare class: PlayerClass;

    @AllowNull(false)
    @Column(DataType.ENUM(...ALIGNMENTS))
    declare alignment: PlayerAlignment;

    @Default(1)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare level: number;

    @Default(0)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare xp: number;

    // === Core Stats (JSONB) ===
    /**
     * {
     *   hp: { current: number, max: number },
     *   ac: number,
     *   thac0: number,
     *   abilities: { str:number,dex:number,con:number,int:number,wis:number,cha:number },
     *   saves?: { paralyzationPoisonDeath:number, rodStaffWand:number, petrificationPolymorph:number, breathWeapon:number, spell:number }
     * }
     */
    @AllowNull(false)
    @Column(DataType.JSONB)
    declare stats: IPlayer["stats"];

    // === Session / Combat State ===
    @Default("close")
    @Column(DataType.ENUM("melee", "close", "far", "beyond"))
    declare zone?: Zone;

    @Default([])
    @Column(DataType.ARRAY(DataType.ENUM(
        "poisoned", "stunned", "blinded", "prone", "restrained", "charmed", "fear", "paralyzed"
    )))
    declare conditions?: Condition[];

    @Default("alive")
    @Column(DataType.ENUM("alive", "unconscious", "dead"))
    declare status?: LifeStatus;

    @Default(0)
    @Column(DataType.INTEGER)
    declare initiativeMod?: number;

    // === Growth / Knowledge ===
    /**
     * {
     *   weapons?: string[],
     *   nonWeapons?: string[]
     * }
     */
    @Default({})
    @Column(DataType.JSONB)
    declare proficiencies?: IPlayer["proficiencies"];

    /**
     * {
     *   known?: string[],
     *   memorized?: string[],
     *   slots?: { [lvl: string]: { used:number, total:number } }
     * }
     */
    @Default({})
    @Column(DataType.JSONB)
    declare spells?: IPlayer["spells"];

    // === Inventory (JSONB array of discriminated items) ===
    /**
     * InventoryItem[] where each item is one of:
     * - { type:"weapon", name, value, damage, properties?[] }
     * - { type:"armor", name, value, ac, shield? }
     * - { type:"potion", name, value, effect }
     * - { type:"misc",   name, value, notes? }
     */
    @Default([])
    @Column(DataType.JSONB)
    declare inventory: IPlayer["inventory"];

    // === Flavor / QoL ===
    @Column(DataType.TEXT)
    declare background?: string;

    @Default([])
    @Column(DataType.JSONB) // array of strings is fine in JSONB; portable
    declare personalityTraits?: string[];

    @Column(DataType.TEXT)
    declare notes?: string;

    // === Economy / Encumbrance ===
    @Default(0)
    @Column(DataType.INTEGER)
    declare gold?: number;

    @Column(DataType.ENUM("unencumbered", "light", "medium", "heavy"))
    declare encumbranceTier?: "unencumbered" | "light" | "medium" | "heavy";
}
