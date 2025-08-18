export type PlayerRace =
    | "human" | "elf" | "dwarf"
    | "orc" | "halfling" | "gnome"
    | "half-elf" | "half-orc";

export type PlayerClass =
    | "Fighter" | "Cleric" | "Mage"
    | "Thief";

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