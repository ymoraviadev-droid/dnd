import { userRepo } from "../../infrastructure/db/repositories/User.repo.js";

export const getUser = async (id: number) => {
    const user = await userRepo.findById(id);
    if (!user) throw new Error("User not found");
    const { password, createdAt, updatedAt, ...safe } = user.dataValues;
    return safe;
};