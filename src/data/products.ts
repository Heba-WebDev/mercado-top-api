import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import Users from './users';
import Locations from './locations';
import Category from './categories';
import Currencies from './currencies';

@Table({tableName: "products", timestamps: true, freezeTableName: true })
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

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  category_id?: number;

  @BelongsTo(() => Category)
  category?: Category;

  @ForeignKey(() => Currencies)
  @Column(DataType.INTEGER)
  currency_id?: number;

  @BelongsTo(() => Currencies)
  currency?: Currencies;


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
  type: DataType.DATE,
  allowNull: true,
  })
  createdAt?: Date;

  @Column({
  type: DataType.DATE,
  allowNull: true,
  })
  updatedAt?: Date;


  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_active?: boolean;

}
