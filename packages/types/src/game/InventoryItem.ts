export type InventoryItem =
    | {
        id: number;
        type: "weapon";
        name: string;
        value: number;
        damage: string;       // e.g., "1d8"
        properties?: string[]; // e.g., ["two-handed","silvered"]
    }
    | {
        id: number;
        type: "armor";
        name: string;
        value: number;
        ac: number;           // armor’s base AC (2e style: lower is better)
        shield?: boolean;
    }
    | {
        id: number;
        type: "potion";
        name: string;
        value: number;
        effect: string;       // short rules text, e.g., "Cure Light Wounds 1d8+1"
    }
    | {
        id: number;
        type: "misc";
        name: string;
        value: number;
        notes?: string;
    };