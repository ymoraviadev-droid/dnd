import 'reflect-metadata';
import { env } from '@dnd/env';
import { Sequelize } from 'sequelize-typescript';
import { UserModel } from './models/Auth/UserModel.js';
import { log } from '../../utils/log.js';
import { RefreshTokenModel } from './models/Auth/RefreshTokenModel.js';
import { PlayerModel } from './models/Game/PlayerModel.js';

const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE } = env;

class DbService {
    private static instance: Sequelize;

    private constructor() { }

    private static getInstance(): Sequelize {
        if (!DbService.instance) {
            DbService.instance = new Sequelize({
                dialect: 'postgres',
                host: PG_HOST,
                port: Number(PG_PORT),
                username: PG_USER,
                password: PG_PASSWORD,
                database: PG_DATABASE,
                models: [UserModel, RefreshTokenModel, PlayerModel],
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
            await sequelize.sync();
            console.log('✅ Database connection established');

            if (env.NODE_ENV === 'development') {
                await sequelize.sync({ alter: true });
                log('DB Initialized Successfully', "info");
            }
        } catch (error) {
            console.error('❌ Database connection failed', error);
            throw error;
        }
    }
}

export const connectToDb = DbService.connect;

