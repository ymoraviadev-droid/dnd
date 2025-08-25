import 'reflect-metadata';
import { env } from '@dnd/env';
import { Sequelize } from 'sequelize-typescript';
import { createLogger } from "@dnd/logger";
import { RefreshTokenModel } from '../models/Auth/RefreshTokenModel.js';
import { UserModel } from '../models/Auth/UserModel.js';
import { CampaignModel } from '../models/Game/CampaignModel.js';
import { PlayerModel } from '../models/Game/PlayerModel.js';
import { WorldModel } from '../models/Game/WorldModel.js';

const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE } = env;
const log = createLogger({ service: "api" });
log.patchConsole();

class DbService {
    private static instance: Sequelize;

    private constructor() { }

    public static getInstance(): Sequelize {
        if (!DbService.instance) {
            DbService.instance = new Sequelize({
                dialect: 'postgres',
                host: PG_HOST,
                port: Number(PG_PORT),
                username: PG_USER,
                password: PG_PASSWORD,
                database: PG_DATABASE,
                models: [UserModel, RefreshTokenModel, PlayerModel, CampaignModel, WorldModel],
                logging: false,
                define: {
                    timestamps: true
                }
            });
        }
        return DbService.instance;
    }

    public static async connect(): Promise<void> {
        const sequelize = DbService.getInstance();
        try {
            await sequelize.authenticate();
            console.log('✅ Database connection established');

            if (env.NODE_ENV === 'development') {
                await sequelize.sync({ alter: true });
                log.info('DB Initialized Successfully');
            }
        } catch (error) {
            log.error(`Database connection failed: ${error}`);
            throw error;
        }
    }
}

export const sequelize = DbService.getInstance();
export const connectToDb = DbService.connect;

