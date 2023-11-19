import express, { Request, Response } from "express";
import cors from "cors";
import sequelize from "./data/db";
import { userRouter } from "./routes/users.route";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);

const connectToDB =  async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync({alter: true});
    console.log("Connection to DB has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
};

const startServer = () => {
  app.listen(port, () => {
    console.log(`APP RUNNING ON PORT ${port}`);
  });
};

const initializeApp = async () => {
  const dbConnectionSuccessful = await connectToDB();
  if (dbConnectionSuccessful) {
    startServer();
  }
};

initializeApp();
