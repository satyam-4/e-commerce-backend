import { body, param } from "express-validator";

export const createProductValidator = [
    body("name")
        .notEmpty().withMessage("Product name is required").bail()
        .isString().withMessage("Product name must be a string").bail()
        .isLength({ min: 2, max: 100 }).withMessage("Product name must be between 2 and 100 characters"),

    body("description")
        .notEmpty().withMessage("Product description is required").bail()
        .isString().withMessage("Product description must be a string").bail()
        .isLength({ min: 10, max: 500 }).withMessage("Product description must be between 10 and 500 characters"),

    body("subcategoryId")
        .notEmpty().withMessage("Subcategory Id is required").bail()
        .isInt({ gt: 0 }).withMessage("Subcategory Id must be a positive integer").bail()
        .toInt()
];

export const createProductVariantValidator = [
    param("productId")
        .notEmpty().withMessage("Product id is required").bail()
        .isInt({ gt: 0 }).withMessage("Product id must be a postive integer").bail()
        .toInt(),

    body("sku")
        .notEmpty().withMessage("SKU is required").bail()
        .isString().withMessage("SKU must be a string")
        .isLength({ max: 100 }).withMessage("SKU must not exceed 100 characters")
        .trim(),
    
    body("attributes")
        .notEmpty().withMessage("Attributes are required").bail()
        .isObject().withMessage("Attributes must be a valid JSON object"),
]

export const deleteProductVariantValidator = [
    param("productId")
        .notEmpty().withMessage("Product id is required").bail()
        .isInt({ gt: 0 }).withMessage("Product id must be a positive integer").bail()
        .toInt(),

    param("productVariantId")
        .notEmpty().withMessage("Product variant id is required").bail()
        .isInt({ gt: 0 }).withMessage("Product variant id must be a positive integer").bail()
        .toInt()
]

export const getProductByIdValidator = [
    param("id")
        .isInt({ min: 1 }).withMessage("Product ID must be an integer").bail()
        .toInt(),
];

export const updateProductValidator = [
    param("id")
        .notEmpty().withMessage("Product ID is required").bail()
        .isInt({ min: 1 }).withMessage("Product ID must be an integer").bail()
        .toInt(),

    body("name")
        .optional()
        .isString().withMessage("Product name must be a string").bail()
        .isLength({ min: 2, max: 100 }).withMessage("Product name must be between 2 and 100 characters"),
        
    body("price")
        .optional()
        .isFloat({ min: 1, max: 1000000 }).withMessage("Price must be between 1 and 1,000,000").bail()
        .toFloat(),

    body("description")
        .optional()
        .isString().withMessage("Product description must be a string").bail()
        .isLength({ min: 10, max: 500 }).withMessage("Product description must be between 10 and 500 characters"),

    body()
        .custom((_, { req }) => {
            const allowedFields = ["name", "price", "description"];
            Object.keys(req.body).forEach((field) => {
                if(!allowedFields.includes(field))
                    delete req.body[field];
            });

            if(Object.keys(req.body).length === 0)
                throw new Error("At least one field must be provided");

            return true;
        })
];

export const deleteProductValidator = [
    param("id")
        .isInt({ min: 1 }).withMessage("Product ID must be integer").bail()
        .toInt(),
];