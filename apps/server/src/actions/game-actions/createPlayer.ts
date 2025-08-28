import { createPlayerRow } from '@dnd/redis-adapter';
import { CreatePlayerBody } from '@dnd/zod-schemas';

export const createPlayer = async (input: CreatePlayerBody, userId: number) => {
    const { name, race, class: cls, alignment, abilities } = input;

    const level = 1;
    const xp = 0;
    const thac0 = 20;
    const ac = 10;

    const hpMax = 8 + Math.floor((abilities.con - 10) / 2);
    const hp = { current: hpMax, max: hpMax };

    const created = await createPlayerRow({
        userId,
        name,
        race,
        class: cls,        // keep field name "class" in DB
        alignment,
        level,
        xp,
        stats: { hp, ac, thac0, abilities },
        inventory: [],
    });

    // consumer stringifies models; you should already get plain JSON here
    const { createdAt, updatedAt, ...safePlayer } = created;
    return safePlayer;
};
