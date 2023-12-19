import { Sequelize } from "sequelize-typescript";
import Users from "./users";
import Locations from "./locations";
import Products from "./products";
import Categories from "./categories";
import Currencies from "./currencies";

const sequelize = new Sequelize(
  process.env.DATABASE as string,
  process.env.USER_NM as string,
  process.env.PASSWORD as string,
  {
    host: process.env.HOST,
    dialect: "postgres",
    define: {
        freezeTableName: true,
    },
    models: [Users, Locations, Products, Categories, Currencies]
  },
);

export default sequelize;
