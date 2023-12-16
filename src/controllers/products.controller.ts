import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Locations from "../data/locations";
import Products from "../data/products";
import cloudinary from "../utils/cloudinary";
import { wrapper } from "../middlewares/asyncWrapper";
import { statusCode } from "../utils/httpStatusCode";
import { globalError } from "../utils/globalError";
import Users from "../data/users";
import Categories from "../data/categories";
const { SUCCESS, FAIL } = statusCode;


const getAllProducts = wrapper(async(req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 2;
    const offset = (page - 1) * limit;
    const totalProducts = await Products.count();
    const totalPages = Math.ceil(totalProducts / limit);

    const result = await Products.findAll({
        where: {is_active: true},
        limit: limit,
        offset: offset
    });

    if (result.length === 0) {
    const err = new globalError("No product found.", 404
        ,FAIL)
    return next(err);
    }

    res.send({
    status: SUCCESS,
    data: result,
    totalPages: totalPages,
  });
});


const getProductById = wrapper(async(req: Request, res: Response, next: NextFunction) => {
    const product_id = req.params.id;
    const result = await Products.findOne({
        where: {product_id: product_id}
    });

    if (!result) {
    const err = new globalError("No product found.", 404
        ,FAIL)
    return next(err);
    }


    res.status(200).send({
    status: SUCCESS,
    data: result,
    });
});

const createProduct = wrapper(async(req: Request, res: Response, next: NextFunction) => {
    const {user_id, country, title, description, price, category_id} = req.body;
    if (!user_id || !country || !title || !description || !price || !category_id) {
        const err = new globalError("user_id, title, description, price and category_id are required.", 400
        ,FAIL)
        return next(err);
    } else if (!req.file) {
        const err = new globalError("A photo of the product is requeired.", 400
        ,FAIL)
        return next(err);
    }

    const usr = await Users.findOne({
        where: {user_id: user_id}
    });

    if (!usr) {
        const err = new globalError("User not found.", 400
        ,FAIL)
        return next(err);
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const category = await Categories.findOne({
        where: {category_id: category_id}
    })

    if (!category) {
        const err = new globalError("Category is not found.", 400
        ,FAIL)
        return next(err);
    }

    Products.create({
        user_id: user_id,
        title: title,
        description: description,
        price: price,
        photo_1: result.secure_url,
        category_id: category_id,
        }).then((result) => {
            return res.status(201).send({
            status: SUCCESS,
            message: "Product successfully posted.",
            data: result
        })
    })
});

const deleteProduct = wrapper(async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    const authHeader = req.headers["Authorization"] || req.headers["authorization"];
    if (!authHeader) {
        const err = new globalError("Token is required.", 401
        ,FAIL)
        return next(err);
    }
    const decodedToken = jwt.verify(authHeader as string, process.env.JWT_SECRET_KEY as string) as jwt.JwtPayload;
    const userId = decodedToken?.user_id;
    const usr = await Users.findOne({
        where: {user_id: userId}
    });
    const product = await Products.findOne({
        where: {
            product_id: id,
            user_id: userId
        }
    })

    if (!usr || !product) {
        const err = new globalError("Invalid product number or token.", 401
        ,FAIL)
        return next(err);
    }
    Products.destroy({
            where: {product_id: id}
    }).then((result) => {
        res.status(200).send({
        status: SUCCESS,
        message: "Product successfully deleted.",
        data: null
    })
    })

});

export {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct
}