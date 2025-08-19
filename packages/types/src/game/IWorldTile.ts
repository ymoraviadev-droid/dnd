import { Biome } from "./Unions.js";

export interface IWorldTile {
    id: string;         // "r{row}c{col}"
    row: number;
    col: number;
    biome: Biome;
    elevation: number;      // גובה יחסי
    movementCost: number;   // כמה קשה לנוע
    danger: number;         // רמת סיכון 0..N
    poi?: Array<
        | { type: "town"; name: string; level: number; townId: string }
        | { type: "dungeon_entrance"; dungeonId: string; floor: number }
    >;
    discovered: boolean;    // האם כבר נחשף ע"י השחקנים
};