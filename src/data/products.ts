import { Table, Model, DataType } from 'sequelize-typescript';
import { ForeignKey } from 'sequelize';
import sequelize from './db';
import Users from './users';
import Locations from './locations';

@Table({tableName: "products", timestamps: false, freezeTableName: true })
export default class Products extends Model {
    declare product_id: number;
    declare user_id:ForeignKey<Users["user_id"]>;
    declare location_id: ForeignKey<Locations["location_id"]>;
    declare title: string;
    declare description: string;
    declare price: number;
    declare photo_1: string;
    declare photo_2: string;
    declare photo_3: string;
    declare posted_at: number;
    declare is_active: boolean;
}

Products.init(
    {
       product_id: {
        type: DataType.UUID,
        primaryKey: true,
       },
       user_id: {
            type: DataType.UUID,
            references: {
                model: "users",
                key: "user_id",
            },
        },
        location_id: {
            type: DataType.INTEGER,
            references: {
                model: "locations",
                key: "location_id",
            },
        },
        title: {
            type: DataType.STRING,
            allowNull: false,
            validate:{len: [5, 150]}
        },
        description: {
            type: DataType.STRING,
            allowNull: false,
            validate: {len: [5, 180]}
        },
        price: {
            type: DataType.DECIMAL,
            allowNull: false,
            validate: {isNumeric: true}
        },
        photo_1: {
            type: DataType.STRING,
            allowNull: false,
        },
        photo_2: {
            type: DataType.STRING,
            allowNull: true,
        },
        photo_3: {
            type: DataType.STRING,
            allowNull: true,
        },
        posted_at: {
            type: DataType.TIME,
            allowNull: false,
        },
        is_active: {
            type: DataType.BOOLEAN,
            allowNull: false,
        }
    },
    {
        sequelize: sequelize,
        tableName: "locations",
        modelName: "Locations",
    }
)
