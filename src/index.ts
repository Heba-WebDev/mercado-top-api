import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import sequelize from "./data/db";
import { userRouter } from "./routes/users.route";
import { CustomError } from "./interfaces/customError";
import { statusCode } from "./utils/httpStatusCode";
import { productsRouter } from "./routes/products.route";
import { locationsRouter } from "./routes/locations.route";
const { FAIL } = statusCode;

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/products", productsRouter);
app.use("/api/locations", locationsRouter);

app.use((error: CustomError, req: Request, res: Response, next: NextFunction): void => {
  res.status(error?.statusCode || 500).send({status: FAIL, mesaage: error.message})
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({
    status: FAIL,
    message: "Resource not found."
  })
})

const connectToDB =  async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync();
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
