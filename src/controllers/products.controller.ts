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
import Currencies from "../data/currencies";
const { SUCCESS, FAIL } = statusCode;


const getAllProducts = wrapper(async(req: Request, res: Response, next: NextFunction) => {

    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const offset = (page - 1) * limit;
    const totalProducts = await Products.count();
    const totalPages = Math.ceil(totalProducts / limit);

    const result = await Products.findAll({
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
    const {user_id, country, title, description, price, currency, category_id, quantity} = req.body;
    if (!user_id || !country || !title || !description || !price || !currency || !category_id || !quantity) {
        const err = new globalError("user_id, title, description, price, currency, category_id and quantity are required.", 400
        ,FAIL)
        return next(err);
    } else if (!req.files || !(req.files as { [fieldname: string]: Express.Multer.File[] })['photo_1']) {
        const err = new globalError("A photo of the product is requeired.", 400
        ,FAIL)
        return next(err);
    }

    if (!Number(quantity)) {
        const err = new globalError("Quantity has to be a number.", 400
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

    // const category = await Categories.findOne({
    //     where: {category_id: category_id}
    // });
    // if (!category) {
    //     const err = new globalError("Category is not found.", 400
    //     ,FAIL)
    //     return next(err);
    // }

    // const curr = await Currencies.findOne({
    //     where: {currency_id: currency}
    // });
    // if (!curr) {
    //     const err = new globalError("This currency is not supported.", 400
    //     ,FAIL)
    //     return next(err);
    // }


        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const photo_1 = files['photo_1'] ? files['photo_1'][0] : null;
        const photo_1_result = photo_1 ? await cloudinary.v2.uploader.upload(photo_1.path) : null;
        const photo_2 = files['photo_2'] ? files['photo_2'][0] : null;
        const photo_2_result = photo_2 ? await cloudinary.v2.uploader.upload(photo_2.path) : null;
        const photo_3 = files['photo_3'] ? files['photo_3'][0] : null;
        const photo_3_result = photo_3 ? await cloudinary.v2.uploader.upload(photo_3.path) : null;

    Products.create({
        user_id: user_id,
        user_name: usr.name,
        title: title,
        description: description,
        price: price,
        photo_1: photo_1_result?.secure_url,
        photo_2: photo_2_result ? photo_2_result.secure_url : null,
        photo_3: photo_3_result ? photo_3_result.secure_url : null,
        category_id: category_id,
        currency_id: currency,
        country: country,
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
        const err = new globalError("Invalid product id or token.", 401
        ,FAIL)
        return next(err);
    }
    const url = product.photo_1;
    const publicId = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    try {
        const result = await cloudinary.v2.uploader.destroy(publicId as string);
        console.log('Image successfully deleted from Cloudinary:', result);
    } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
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