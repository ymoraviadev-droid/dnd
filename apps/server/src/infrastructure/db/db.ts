import 'reflect-metadata';
import { env } from '@dnd/env';
import { Sequelize } from 'sequelize-typescript';
import { UserSchema } from './models/Auth/UserSchema.js';

const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE } = env;

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
                models: [UserSchema],
                logging: false,
                define: {
                    timestamps: true
                }
            });
        }
        return DbService.instance;
    }
}

export const sequelize = DbService.getInstance();