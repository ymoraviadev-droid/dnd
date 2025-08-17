import { z } from "zod";
export const BaseEnvSchema = z.object({
    // אפליקציה
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(4000),
    API_URL: z.string().default("http://localhost:4000"),
    // אבטחה
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    REFRESH_SECRET: z.string().min(1, "REFRESH_SECRET is required"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    // Postgres
    PG_HOST: z.string().min(1, "PG_HOST is required"),
    PG_PORT: z.coerce.number().min(1, "PG_PORT is required"),
    PG_USER: z.string().min(1, "PG_USER is required"),
    PG_PASSWORD: z.string().min(1, "PG_PASSWORD is required"),
    PG_DATABASE: z.string().min(1, "PG_DATABASE is required"),
    PASSWORD_PEPPER: z.string().min(1, "PASSWORD_PEPPER is required"),
});
