import jwt from "jsonwebtoken";
import { env } from "@dnd/env";

type TokenTypes = "access" | "register" | "security" | "passwordReset" | "refresh";
const { JWT_SECRET, MAIL_SECRET, PASSWORD_RESET_KEY, SECURITY_KEY, REFRESH_SECRET } = env;

const getSecret = (type: TokenTypes = "access"): string => {
    switch (type) {
        case "register":
            if (!MAIL_SECRET) throw new Error("MAIL_SECRET is undefined");
            return MAIL_SECRET;
        case "security":
            if (!SECURITY_KEY) throw new Error("SECURITY_KEY is undefined");
            return SECURITY_KEY;
        case "passwordReset":
            if (!PASSWORD_RESET_KEY) throw new Error("PASSWORD_RESET_KEY is undefined");
            return PASSWORD_RESET_KEY;
        case "refresh":
            if (!REFRESH_SECRET) throw new Error("REFRESH_SECRET is undefined");
            return REFRESH_SECRET;
        case "access":
        default:
            if (!JWT_SECRET) throw new Error("JWT_SECRET is undefined");
            return JWT_SECRET;
    }
};

const generateToken = (
    _id: string,
    type: TokenTypes = "access",
    expiresIn: jwt.SignOptions["expiresIn"] = "15m"
): string => {
    const secret = getSecret(type) as jwt.Secret;
    const options: jwt.SignOptions = { expiresIn };
    return jwt.sign({ _id }, secret, options);
};

const verifyToken = (tokenFromClient: string, type: TokenTypes = "access") => {
    try {
        return jwt.verify(tokenFromClient, getSecret(type));
    } catch (error) {
        return null;
    }
};



export { generateToken, verifyToken };