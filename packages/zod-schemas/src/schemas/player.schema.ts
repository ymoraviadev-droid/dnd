import { z } from "zod";

// Enums
export const PlayerClassSchema = z.enum(["fighter", "cleric", "mage", "thief"]);
export const PlayerRaceSchema = z.enum(["human", "elf", "dwarf", "orc", "halfling", "gnome", "half-elf", "half-orc"]);
export const PlayerAlignmentSchema = z.enum([
    "lawful-good", "neutral-good", "chaotic-good",
    "lawful-neutral", "true-neutral", "chaotic-neutral",
    "lawful-evil", "neutral-evil", "chaotic-evil",
]);


// Abilities 3–18
export const AbilitiesSchema = z.object({
    str: z.number().int().min(3).max(18),
    dex: z.number().int().min(3).max(18),
    con: z.number().int().min(3).max(18),
    int: z.number().int().min(3).max(18),
    wis: z.number().int().min(3).max(18),
    cha: z.number().int().min(3).max(18),
});

export const CreatePlayerSchema = z.object({
    name: z.string().min(1).max(64),
    race: PlayerRaceSchema,
    class: PlayerClassSchema,
    alignment: PlayerAlignmentSchema,
    abilities: AbilitiesSchema,
});

export type CreatePlayerBody = z.infer<typeof CreatePlayerSchema>;
