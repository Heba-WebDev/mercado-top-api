
import { Router } from "express";
import { createProduct, getAllProducts,
getProductById, deleteProduct } from "../controllers/products.controller";


const productsRouter = Router();

productsRouter.route("/").get(getAllProducts);
productsRouter.route("/:id").get(getProductById);
productsRouter.route("/").post(createProduct);
productsRouter.route("/").delete(deleteProduct);

export {
    productsRouter
}
