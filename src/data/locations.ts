import { Table, Column, Model, DataType, AutoIncrement } from 'sequelize-typescript';

@Table({tableName: "locations", timestamps: false, freezeTableName: true })
export default class Locations extends Model {

  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: true,
  })
  location_id?: number;

  @Column(DataType.STRING)
  country?: string;
}
