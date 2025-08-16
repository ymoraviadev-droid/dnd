import jwt from "jsonwebtoken";
import { env } from "@dnd/env";

const { JWT_SECRET, REFRESH_SECRET } = env;

const generateToken = (
    id: number
): string => {
    const secret = JWT_SECRET as jwt.Secret;
    const options: jwt.SignOptions = { expiresIn: "15m" };
    return jwt.sign({ id }, secret, options);
};

const verifyToken = (tokenFromClient: string, type: "access" | "refresh") => {
    try {
        const secret = type === "access" ? JWT_SECRET : REFRESH_SECRET;
        return jwt.verify(tokenFromClient, secret as jwt.Secret);
    } catch (error) {
        return null;
    }
};

const generateRefreshToken = (
    id: number,
): string => {
    const secret = REFRESH_SECRET as jwt.Secret;
    const options: jwt.SignOptions = { expiresIn: "7d" };
    return jwt.sign({ id }, secret, options);
};

const refreshToken = (tokenFromClient: string) => {
    const payload = verifyToken(tokenFromClient, "refresh");
    if (!payload) return null;

    const { id } = payload as { id: number };
    return generateToken(id);
};


export { generateToken, verifyToken, refreshToken, generateRefreshToken };