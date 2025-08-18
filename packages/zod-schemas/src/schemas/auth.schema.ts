import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(6).max(128),
}).strict();

export const LoginByTokenSchema = z.object({
    token: z.string().min(6).max(512),
}).strict();

export const RegisterSchema = z.object({
    name: z.string().trim().min(1, "name is required").max(60),
    email: z
        .string()
        .trim()
        .email("Invalid email")
        .transform((v) => v.toLowerCase()),
    password: z.string().min(6, "Password must be at least 6 characters").max(128),
}).strict();

export type RegisterBody = z.infer<typeof RegisterSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;
export type LoginByTokenBody = z.infer<typeof LoginByTokenSchema>;
