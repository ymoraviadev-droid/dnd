import { z } from "zod";

export const WorldMetaSchema = z.object({
    seed: z.string().min(1),
    size: z.object({
        rows: z.number().int().min(1),
        cols: z.number().int().min(1),
    }),
    currentTile: z.object({
        row: z.number().int().min(0),
        col: z.number().int().min(0),
    }),
});

export const CampaignSchema = z.object({
    id: z.number().int().positive(), // DB id
    name: z.string().min(2),
    ownerId: z.number().int().positive(),
    leaderId: z.number().int().positive(),
    playerIds: z.array(z.number().int().positive()).default([]),
    invitedIds: z.array(z.number().int().positive()).optional(),
    status: z.enum(["draft", "waiting", "active", "paused_afk", "ended"]).default("waiting"),
    world: WorldMetaSchema,
    main_prompt: z.string().min(5),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});
export type CampaignBody = z.infer<typeof CampaignSchema>;

export const BiomeSchema = z.enum([
    "forest", "plains", "mountain", "desert", "swamp", "coast", "lake", "river", "city",
]);

// Point of Interest
export const POISchema = z.union([
    z.object({
        type: z.literal("town"),
        name: z.string(),
        level: z.number().int().min(1),
        townId: z.string(),
    }),
    z.object({
        type: z.literal("dungeon_entrance"),
        dungeonId: z.string(),
        floor: z.number().int().min(0),
    }),
]);

// World Tile
export const WorldTileSchema = z.object({
    id: z.string(), // "r{row}c{col}"
    row: z.number().int().min(0),
    col: z.number().int().min(0),
    biome: BiomeSchema,
    elevation: z.number(),
    movementCost: z.number().int().min(0),
    danger: z.number().int().min(0),
    poi: z.array(POISchema).optional(),
    discovered: z.boolean(),
});

// Whole World
export const WorldSchema = z.object({
    id: z.number().int().positive().optional(), // primary key אם יש
    campaignId: z.number().int().positive(),
    seed: z.string().min(1),
    size: z.object({
        rows: z.number().int().min(1),
        cols: z.number().int().min(1),
    }),
    tiles: z.array(WorldTileSchema),
    rules: z.object({
        wrap: z.boolean(),
        waterBlocks: z.boolean(),
    }),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});
export type WorldBody = z.infer<typeof WorldSchema>;

export const CreateCampaignSchema = z.object({
    name: z.string().min(2).max(100),
    invitedIds: z.array(z.number().int().positive()).optional(),
});
export type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>;
