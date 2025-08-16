import { Table, Column, DataType } from 'sequelize-typescript'; // Remove HasMany import
import { IUser } from '@dnd/types';
// Remove Item import
import { Entity } from '../Common/Entity.js';

@Table({
    tableName: 'users',
    timestamps: true
})

export class UserSchema extends Entity implements IUser {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null
    })
    declare refreshToken?: string;
}
