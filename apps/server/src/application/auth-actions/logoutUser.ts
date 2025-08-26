import { getRefreshTokenRow, getUserById, deleteRefreshTokenByUserId } from "../../infrastructure/db/adapters/authRepoAdapter.js";

export const logoutUser = async (id: number) => {
    const user = await getUserById(id);
    const refreshToken = await getRefreshTokenRow(id);

    if (!user || !refreshToken) throw new Error("Unauthorized");

    await deleteRefreshTokenByUserId(id);

    return { message: "User logged out successfully" };
};
