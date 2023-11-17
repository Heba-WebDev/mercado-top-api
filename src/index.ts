import express, { Request, Response } from "express";
import cors from "cors";
import sequelize from "./data/db";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send("Hello");
});

const connectToDB =  async () => {
  try {
    await sequelize.authenticate();
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
