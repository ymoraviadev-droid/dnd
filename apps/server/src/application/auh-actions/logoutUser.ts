import { refreshTokenRepo } from "../../infrastructure/db/repositories/RefreshToken.repo.js";
import { userRepo } from "../../infrastructure/db/repositories/User.repo.js";

export const logoutUser = async (id: number) => {

    const user = await userRepo.findById(id);
    const refreshToken = await refreshTokenRepo.findByUserId(id);

    if (!user || !refreshToken) throw new Error("Unauthorized");

    await refreshTokenRepo.remove({ id: refreshToken.id });
    return { message: "User logged out successfully" };
};