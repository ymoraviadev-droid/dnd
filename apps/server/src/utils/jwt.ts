import jwt from "jsonwebtoken";
import { env } from "@dnd/env";

const { JWT_SECRET, REFRESH_SECRET } = env;

const generateToken = (
    id: number, type: "access" | "refresh"
): string => {
    const secret = type === "access" ? JWT_SECRET : REFRESH_SECRET;
    const options: jwt.SignOptions = { expiresIn: type === "access" ? "15m" : "7d" };
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

export { generateToken, verifyToken };