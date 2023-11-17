import { Table, Model, DataType } from 'sequelize-typescript';
import sequelize from './db';

@Table({tableName: "locations", timestamps: false, freezeTableName: true })
export default class Locations extends Model {
    declare location_id: number;
    declare country: string;
}

Locations.init(
    {
        location_id: {
            type: DataType.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        country: {
            type: DataType.STRING,
        }
    },
    {
        sequelize: sequelize,
        tableName: "locations",
        modelName: "Locations",
    }
)
