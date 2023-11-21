import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import Users from './users';
import Locations from './locations';

@Table({tableName: "products", timestamps: false, freezeTableName: true })
export default class Products extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  product_id?: number;

  @ForeignKey(() => Users)
  @Column(DataType.UUID)
  user_id?: number;
  @BelongsTo(() => Users)
  user?: Users;

  @ForeignKey(() => Locations)
  @Column(DataType.STRING)
  country?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate:{len: [5, 150]}
  })
  title?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {len: [5, 180]}
  })
  description?: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
    validate: {isNumeric: true}
  })
  price?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  photo_1?: string;

  @Column(DataType.STRING)
  photo_2?: string;

  @Column(DataType.STRING)
  photo_3?: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  posted_at?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_active?: boolean;

}
