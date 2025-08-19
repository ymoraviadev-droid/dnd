import type { Transaction } from "sequelize";
import { randomUUID, createHash } from "crypto";
import { sequelize } from "../../infrastructure/db/db.js";
import { campaignRepo } from "../../infrastructure/db/repositories/Campaign.repo.js";
import { worldRepo } from "../../infrastructure/db/repositories/World.repo.js";
import { generateWorld } from "./generateWorld.js";
import { CreateCampaignInput } from "../../types/CreateCampaignInput.js";

const size = 9;

const makeSeed = (name: string, ownerId: number) => {
    const raw = `${name}:${ownerId}:${randomUUID()}`;
    return createHash("sha256").update(raw).digest("hex").slice(0, 16);
};

const makeWorldPrompt = (name: string, seed: string): string => {
    const climates = ["frozen tundra", "endless desert", "ashen forest", "storm-wracked coast"];
    const threats = ["shadow beasts", "forgotten gods", "arcane warlords", "mechanical titans"];
    const ruins = ["ancient temple", "crumbling fortress", "abandoned mine", "buried catacombs"];

    const hash = [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const climate = climates[hash % climates.length];
    const threat = threats[(hash >> 3) % threats.length];
    const ruin = ruins[(hash >> 5) % ruins.length];

    return [
        `Campaign name: "${name}".`,
        `This world was shaped by a ${climate}, where ${threat} still roam.`,
        `Adventurers begin their journey near a ${ruin}, whispered to hide untold secrets.`,
        `Legends promise danger, treasure, and destiny for those brave enough to explore.`
    ].join(" ");
};

export const createCampaignAndWorld = async (input: CreateCampaignInput) => {

    const invitedUnique =
        Array.from(new Set((input.invitedIds ?? []).filter((id) => Number.isInteger(id))))
            .filter((id) => id !== input.ownerId);

    const seed = makeSeed(input.name, input.ownerId);
    const main_prompt = makeWorldPrompt(input.name, seed);

    return sequelize.transaction(async (t: Transaction) => {
        const campaign = await campaignRepo.create({
            name: input.name,
            ownerId: input.ownerId,
            leaderId: input.ownerId,
            playerIds: [input.ownerId],
            invitedIds: invitedUnique,
            status: "waiting",
            world: {
                seed,
                size: { rows: size, cols: size },
                currentTile: { row: 0, col: 0 },
            },
            main_prompt,
        }, t);

        const world = generateWorld(
            campaign.id,
            seed,
            { rows: size, cols: size },
            { towns: 2, dungeons: 3, wrap: false, waterBlocks: true }
        );

        await worldRepo.create({
            campaignId: campaign.id,
            data: world,
        }, t);

        return { campaign: campaign.toJSON(), world };
    });
};
