export { z } from "zod";
export type { ZodSchema } from "zod";

export * from "./schemas/auth.schema";

export type {
    LoginBody,
    RegisterBody,
    LoginByTokenBody,
} from "./schemas/auth.schema.ts";

export {
    CreatePlayerSchema,
    AbilitiesSchema,
    PlayerAlignmentSchema,
    PlayerClassSchema,
    PlayerRaceSchema
} from "./schemas/player.schema";

export type { CreatePlayerBody } from "./schemas/player.schema";

export { BaseEnvSchema } from "./schemas/env.schema";

