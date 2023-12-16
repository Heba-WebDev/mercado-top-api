import { Table, Column, Model, DataType, AutoIncrement } from "sequelize-typescript";

@Table({tableName: "currencies", timestamps: false, freezeTableName: true})
export default class Currencies extends Model {
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false
    })
    currency_id?: number;
    @Column(DataType.STRING)
    currency_symbol?: string;
    @Column(DataType.STRING)
    currency_name?: string;
}
