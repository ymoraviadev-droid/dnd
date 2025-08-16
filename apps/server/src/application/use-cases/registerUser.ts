import { RegisterBody } from "@dnd/zod-schemas";
import { userRepo } from "../../infrastructure/db/repositories/User.repo.js";

export async function registerUser(userData: RegisterBody) {

    const existing = await userRepo.findByEmail(userData.email);
    if (existing) throw new Error("User already exists");

    const user = await userRepo.create(userData);
    return user;
}
