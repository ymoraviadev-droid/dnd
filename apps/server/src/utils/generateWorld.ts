// world/generateWorld.ts

import { Biome, IWorld, IWorldTile } from "@dnd/types";

// --- RNG דטרמיניסטי ---
function cyrb128(str: string) {
    let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1 ^ h2 ^ h3 ^ h4) >>> 0];
}
function mulberry32(a: number) {
    return function () {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// רעש פשוט לפי קואורדינטות
function noise2(randSeed: string, x: number, y: number, scale = 0.15) {
    const s = cyrb128(`${randSeed}:${Math.floor(x * scale)}:${Math.floor(y * scale)}`)[0];
    const r = mulberry32(s);
    // 2 אוקטבות קטנות לתת טיפה "מרקם"
    const a = r();
    const b = mulberry32(s ^ 0x9E3779B1)();
    return (a * 0.7 + b * 0.3);
}

// התאמות ביומים בסיסיות לפי elevation/moisture
function pickBiome(elev: number, moist: number): Biome {
    if (elev < 0.18) return "coast";
    if (elev < 0.24 && moist > 0.5) return "lake";
    if (elev > 0.8) return "mountain";
    if (moist < 0.2) return "desert";
    if (moist < 0.4) return "plains";
    if (moist < 0.7) return "forest";
    return "swamp";
}

function movementCostFor(biome: Biome): number {
    switch (biome) {
        case "plains": return 1;
        case "forest": return 2;
        case "desert": return 2;
        case "swamp": return 3;
        case "mountain": return 3;
        case "river": return 2;
        case "lake": return 99;    // חוסם בפועל
        case "coast": return 1;
        case "city": return 1;
        default: return 1;
    }
}

// ממקמים עיירות ודאנ׳נים פשוט
function placePOIs(
    tiles: IWorldTile[],
    seed: string,
    towns = 2,
    dungeons = 3
) {
    const base = cyrb128(`poi:${seed}`)[0];
    const r = mulberry32(base);

    // בחר משבצות לעיירות: עדיף plains/forest/coast, לא lake/mountain/swamp
    const townCandidates = tiles.filter(t =>
        (t.biome === "plains" || t.biome === "forest" || t.biome === "coast") &&
        t.movementCost < 3
    );
    for (let i = 0; i < towns && townCandidates.length; i++) {
        const idx = Math.floor(r() * townCandidates.length);
        const tile = townCandidates.splice(idx, 1)[0];
        const townId = `town-${tile.row}-${tile.col}`;
        tile.poi = [...(tile.poi ?? []), { type: "town", name: `Town_${i + 1}`, level: 1 + i, townId }];
        // תהפוך לביומ "city" וקל לתנועה
        tile.biome = "city" as Biome;
        tile.movementCost = 1;
    }

    // דאנג'נים: באזורים קצת "קשים"
    const dngCandidates = tiles.filter(t =>
        t.biome !== "city" && t.biome !== "lake" && t.biome !== "coast"
    );
    for (let i = 0; i < dungeons && dngCandidates.length; i++) {
        const idx = Math.floor(r() * dngCandidates.length);
        const tile = dngCandidates.splice(idx, 1)[0];
        const dungeonId = `dgn-${tile.row}-${tile.col}`;
        tile.poi = [...(tile.poi ?? []), { type: "dungeon_entrance", dungeonId, floor: 0 }];
        // תן קצת “סכנה”
        tile.danger = Math.max(tile.danger, 2);
    }
}

export function generateWorld(
    campaignId: number,
    seed: string,
    size: { rows: number; cols: number },
    opts?: { towns?: number; dungeons?: number; wrap?: boolean; waterBlocks?: boolean }
): IWorld {
    const { rows, cols } = size;
    const tiles: IWorldTile[] = [];

    // בסיסי: elevation/moisture ע״י רעש
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const elev = noise2(seed + ":elev", row, col, 0.12);     // 0..1
            const moist = noise2(seed + ":moist", row, col, 0.18);   // 0..1
            let biome = pickBiome(elev, moist);
            const id = `r${row}c${col}`;
            const movementCost = movementCostFor(biome);
            const danger = Math.max(0, Math.floor((elev * 0.8 + (1 - moist) * 0.6) * 3));

            tiles.push({
                id, row, col,
                biome,
                elevation: Number(elev.toFixed(2)),
                movementCost,
                danger,
                discovered: (row === 0 && col === 0), // משבצת התחלה נחשפת
            });
        }
    }

    placePOIs(tiles, seed, opts?.towns ?? 2, opts?.dungeons ?? 3);

    return {
        campaignId,
        seed,
        size: { rows, cols },
        tiles,
        rules: {
            wrap: !!opts?.wrap,
            waterBlocks: opts?.waterBlocks ?? true
        }
    };
}
