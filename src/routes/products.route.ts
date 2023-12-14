
import { Router } from "express";
import { createProduct, getAllProducts,
getProductById, deleteProduct } from "../controllers/products.controller";
import upload from "../middlewares/multer";


const productsRouter = Router();

productsRouter.route("/").get(getAllProducts);
productsRouter.route("/:id").get(getProductById);
productsRouter.route("/").post(upload.single('photo_1'), createProduct);
productsRouter.route("/").delete(deleteProduct);

export {
    productsRouter
}
