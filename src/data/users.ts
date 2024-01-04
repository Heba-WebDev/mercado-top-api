import { Table, Column, Model, DataType, ForeignKey, Default }
from 'sequelize-typescript';
import Locations  from './locations';

@Table({tableName: "users", timestamps: false, freezeTableName: true })
export default class Users extends Model {

  @Default(DataType.UUIDV4)
  @Column({
    primaryKey: true,
    type: DataType.UUID
  })
  user_id?: number;

  @Column(DataType.STRING)
  name?: string;

  @Column(DataType.STRING)
  username?: string;

  @Default("")
  @Column(DataType.STRING)
  biography?: string;

  @Column({
    type: DataType.STRING,
    validate: {isEmail: true},
    unique: 'email',
  })
  email?: string;

  @Default("black-guy.jpg")
  @Column({
    type: DataType.STRING,
    validate: {len: [4, 70]},
  })
  password?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  profile_picture?: string;

  @ForeignKey(() => Locations)
  @Column(DataType.STRING)
  country?: string;
}
