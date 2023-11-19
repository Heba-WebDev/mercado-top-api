import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({tableName: "locations", timestamps: false, freezeTableName: true })
export default class Locations extends Model {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  location_id?: number;

  @Column(DataType.STRING)
  country?: string;
}
