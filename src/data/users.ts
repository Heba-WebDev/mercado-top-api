import { Table, Column, Model, DataType } from 'sequelize-typescript';
import Locations  from './locations';
import { ForeignKey } from 'sequelize';
import sequelize from "./db"



@Table({tableName: "users", timestamps: false, freezeTableName: true })
export default class Users extends Model {
    declare user_id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare profile_picture: string;
    declare location_id: ForeignKey<Locations["location_id"]>;
}

Users.init(
    {
        user_id: {
            primaryKey: true,
            type: DataType.UUID,
            allowNull: false
        },
        name: {
            type: DataType.STRING,
        },
        email: {
            type: DataType.STRING,
            validate: {isEmail: true},
            unique: true,
        },
        password: {
            type: DataType.STRING,
            validate: {len: [4, 70]},
        },
        profile_picture: {
            type: DataType.STRING,
        },
        location_id: {
            type: DataType.INTEGER,
            references: {
                model: "locations",
                key: "location_id",
            },
        },
    },
    {
        sequelize:  sequelize,
        tableName: "users",
        modelName: "Users",
    },
);
