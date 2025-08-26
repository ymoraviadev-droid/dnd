// src/repositories/index.ts
import { playerRepo } from './Player.repo.js';
import { userRepo } from './User.repo.js';
import { campaignRepo } from './Campaign.repo.js';
import { worldRepo } from './World.repo.js';
import { refreshTokenRepo } from './RefreshToken.repo.js';

export const repoRegistry = {
    player: playerRepo,
    user: userRepo,
    campaign: campaignRepo,
    world: worldRepo,
    refreshToken: refreshTokenRepo,
} as const;

export type RepoRegistry = typeof repoRegistry;
