import { DbRecord } from "../private/DbRecord.js";
import { InventoryItem } from "./InventoryItem.js";
import { SavingThrows } from "./SavingThrows.js";
import { PlayerRace, PlayerClass, PlayerAlignment, Zone, Condition, LifeStatus, EncumbranceTiers } from "./Unions.js";

export interface IPlayer extends DbRecord {
    userId: number;
    name: string;
    race: PlayerRace;
    class: PlayerClass;
    alignment: PlayerAlignment;
    level: number;
    xp: number;

    stats: {
        hp: { current: number; max: number };
        ac: number;                            // lower is better
        thac0: number;                         // store for speed (compute from class/level server-side)
        abilities: {
            str: number; // 3–18
            dex: number;
            con: number;
            int: number;
            wis: number;
            cha: number;
        };
        saves?: SavingThrows;                  // optional now, add when you use spells/traps
    };

    // Combat/session state (LLM-friendly)
    zone?: Zone;                              // default "close" if absent
    conditions?: Condition[];                 // []
    status?: LifeStatus;                      // "alive"
    initiativeMod?: number;                   // e.g., from DEX/weapon/spell

    // Growth/knowledge
    proficiencies?: {
        weapons?: string[];                     // e.g., ["longsword","longbow"]
        nonWeapons?: string[];                  // e.g., ["riding","survival"]
    };

    // Magic (only for casters; optional for others)
    spells?: {
        known?: string[];
        memorized?: string[];
        slots?: Record<string, { used: number; total: number }>; // "lvl1": {used:1,total:2}
    };

    inventory: InventoryItem[];

    // Flavor / QoL (optional)
    background?: string;
    personalityTraits?: string[];
    notes?: string;

    // Economy/encumbrance (optional)
    gold?: number;
    encumbranceTier?: EncumbranceTiers; // e.g., "light"
}
