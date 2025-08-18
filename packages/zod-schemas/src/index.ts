export { z } from "zod";
export type { ZodSchema } from "zod";

export {
    LoginSchema,
    RegisterSchema,
    LoginByTokenSchema
} from "./schemas/auth.schema";

export type {
    LoginBody,
    RegisterBody,
    LoginByTokenBody,
} from "./schemas/auth.schema";

export {
    CreatePlayerSchema,
    AbilitiesSchema,
    PlayerAlignmentSchema,
    PlayerClassSchema,
    PlayerRaceSchema
} from "./schemas/player.schema";

export type { CreatePlayerBody } from "./schemas/player.schema";

export { BaseEnvSchema } from "./schemas/env.schema";

