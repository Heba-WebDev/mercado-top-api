import { Table, Column, Model, DataType, AutoIncrement } from "sequelize-typescript";

@Table({tableName: "categories", timestamps: false, freezeTableName: true})
export default class Categories extends Model {
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false
    })
    category_id?: number;
    @Column(DataType.STRING)
    category_name?: string;
}
