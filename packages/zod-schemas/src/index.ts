export { z } from "zod";
export type { ZodSchema } from "zod";

export {
    LoginSchema,
    RegisterSchema,
    LoginByTokenSchema
} from "./schemas/auth.schema.js";

export type {
    LoginBody,
    RegisterBody,
    LoginByTokenBody,
} from "./schemas/auth.schema.js";

export {
    CreatePlayerSchema,
    AbilitiesSchema,
    PlayerAlignmentSchema,
    PlayerClassSchema,
    PlayerRaceSchema
} from "./schemas/player.schema.js";

export type { CreatePlayerBody } from "./schemas/player.schema.js";

export { BaseEnvSchema } from "./schemas/env.schema.js";

