export type PlayerRace =
    | "human" | "elf" | "dwarf"
    | "orc" | "halfling" | "gnome"
    | "half-elf" | "half-orc";

export type PlayerClass =
    | "fighter" | "cleric" | "mage"
    | "thief";

export type PlayerAlignment =
    | "lawful-good" | "neutral-good" | "chaotic-good"
    | "lawful-neutral" | "true-neutral" | "chaotic-neutral"
    | "lawful-evil" | "neutral-evil" | "chaotic-evil";

export type Zone =
    | "melee" | "close" | "far"
    | "beyond";

export type Condition =
    | "poisoned" | "stunned" | "blinded"
    | "prone" | "restrained" | "charmed"
    | "fear" | "paralyzed";

export type LifeStatus =
    | "alive" | "unconscious" | "dead";

export type EncumbranceTiers =
    | "unencumbered" | "light" | "medium"
    | "heavy";

export type Biome =
    | "forest" | "plains" | "mountain"
    | "desert" | "swamp" | "coast"
    | "lake" | "river" | "city";