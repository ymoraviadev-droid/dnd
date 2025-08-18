import { playerRepo } from "../../infrastructure/db/repositories/Player.repo.js";
import { CreatePlayerBody } from "@dnd/zod-schemas";

export const createPlayer = async (input: CreatePlayerBody, userId: number) => {
    const { name, race, class: cls, alignment, abilities } = input;

    const level = 1;
    const xp = 0;
    const thac0 = 20;
    const ac = 10;
    const hpMax = 8 + Math.floor((abilities.con - 10) / 2);
    const hp = { current: hpMax, max: hpMax };

    const data = await playerRepo.create({
        userId,
        name,
        race,
        class: cls,
        alignment,
        level,
        xp,
        stats: { hp, ac, thac0, abilities },
        inventory: [],
    });
    const { createdAt, updatedAt, ...safePlayer } = data;
    return safePlayer;
}