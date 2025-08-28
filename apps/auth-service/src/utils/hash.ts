import { scrypt, randomBytes, createHash } from 'crypto';
import { promisify } from 'util';
import { env } from '@dnd/env';

const scryptAsync = promisify(scrypt);

const hashPassword = async (password: string) => {
    const salt = randomBytes(16).toString('hex');
    const pepper = env.PASSWORD_PEPPER;
    const derivedKey = await scryptAsync(password + pepper, salt, 64) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
}

const verifyPassword = async (password: string, storedHash: string) => {
    const [salt, key] = storedHash.split(':');
    const pepper = env.PASSWORD_PEPPER;
    const derivedKey = await scryptAsync(password + pepper, salt, 64) as Buffer;
    return key === derivedKey.toString('hex');
}

const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

export { hashPassword, verifyPassword, hashToken };