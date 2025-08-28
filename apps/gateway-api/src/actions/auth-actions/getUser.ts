import { getUserById } from "@dnd/redis-adapter";

export const getUser = async (id: number) => {
    const user = await getUserById(id);
    if (!user) throw new Error("User not found");

    const { password, createdAt, updatedAt, ...safe } = user;
    return safe;
};
