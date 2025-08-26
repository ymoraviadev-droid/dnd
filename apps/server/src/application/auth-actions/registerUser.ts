// src/application/auth-actions/registerUser.ts
import { RegisterBody } from "@dnd/zod-schemas";
import { hashPassword } from "../../utils/hash.js";
import { getUserByEmail, createUser } from "../../infrastructure/db/adapters/authRepoAdapter.js";

export const registerUser = async (userData: RegisterBody) => {
    // 1) guard: email already exists?
    const existing = await getUserByEmail(userData.email);
    if (existing) throw new Error("User already exists");

    // 2) hash password
    const hashedPassword = await hashPassword(userData.password);

    // 3) create via db-service
    try {
        const user = await createUser({ ...userData, password: hashedPassword });

        // 4) strip sensitive fields (service returns plain JSON)
        const { password, createdAt, updatedAt, ...safeUser } = user;
        return safeUser;
    } catch (err: any) {
        // map common DB uniqueness errors to a nicer message
        // Postgres unique violation = 23505; Sequelize often tags `name/code`
        if (err?.code === "23505" || /unique/i.test(String(err?.message))) {
            throw new Error("User already exists");
        }
        throw err;
    }
};
