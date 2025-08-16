import { Column, Model, DataType } from 'sequelize-typescript';

export class Entity extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    declare id: number;
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    declare createdAt: Date;
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    declare updatedAt: Date;
}
