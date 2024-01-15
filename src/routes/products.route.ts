
import { Router } from "express";
import { createProduct, getAllProducts,
getProductById, deleteProduct } from "../controllers/products.controller";
import upload from "../middlewares/multer";

const uploadFields = [
    { name: 'photo_1', maxCount: 1 },
    { name: 'photo_2', maxCount: 1 },
    { name: 'photo_3', maxCount: 1 }
];

const productsRouter = Router();

productsRouter.route("/").get(getAllProducts);
productsRouter.route("/:id").get(getProductById);
productsRouter.route("/").post(upload.fields(uploadFields), createProduct);
productsRouter.route("/").delete(deleteProduct);

export {
    productsRouter
}
