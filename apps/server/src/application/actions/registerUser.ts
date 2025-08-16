import { RegisterBody } from "@dnd/zod-schemas";
import { userRepo } from "../../infrastructure/db/repositories/User.repo.js";
import { hashPassword } from "../../utils/hash.js";

export const registerUser = async (userData: RegisterBody) => {

    const existing = await userRepo.findByEmail(userData.email);
    if (existing) throw new Error("User already exists");

    const hashedPassword = await hashPassword(userData.password);
    const user = (await userRepo.create({ ...userData, password: hashedPassword }));
    const { password, createdAt, updatedAt, refreshToken, ...safeUser } = user.dataValues;
    return safeUser;
}
