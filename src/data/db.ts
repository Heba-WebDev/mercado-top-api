import { Sequelize } from "sequelize-typescript";
import Users from "./users";
import Products from "./products";
import Locations from "./locations";

const sequelize = new Sequelize(
  process.env.DATABASE as string,
  process.env.USER_NM as string,
  process.env.PASSWORD as string,
  {
    host: process.env.HOST,
    dialect: "mysql",
    define: {
        freezeTableName: true,
    },
  },
);

export default sequelize;
