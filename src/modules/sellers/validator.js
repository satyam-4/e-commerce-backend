import { body, param } from "express-validator";

export const createSellerVariantValidator = [
  body("ProductVariantId")
    .notEmpty().withMessage("Variant id is required").bail()
    .isInt({ gt: 0 }).withMessage("Variant id must be a positive integer").bail()
    .toInt(),

  body("price")
    .notEmpty().withMessage("Price is required").bail()
    .isFloat({ gt: 0 }).withMessage("Price must be a number greater than 0").bail()
    .toFloat(),

  body("stock")
    .notEmpty().withMessage("Stock is required").bail()
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer").bail()
    .toInt(),
];

export const getSellerVariantByIdValidator = [
    param("sellerVariantId")
        .notEmpty().withMessage("Seller variant id is required").bail()
        .isInt({ gt: 0 }).withMessage("Seller variant id must be a positive integer").bail()
        .toInt(),
];

export const updateSellerVariantByIdValidator = [
    param("sellerVariantId")
        .notEmpty().withMessage("Seller variant id is required").bail()
        .isInt({ gt: 0 }).withMessage("Seller variant id must be a positive integer").bail()
        .toInt(),

    body("price")
        .optional()
        .isFloat({ gt: 0 }).withMessage("Price must be a number greater than 0").bail()
        .toFloat(),

    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("Stock must be a positive integer").bail()
        .toInt(),

    body()
        .custom((_, { req }) => {
            const allowedFields = ["price", "stock"];

            Object.keys(req.body).forEach((field) => {
                if(!allowedFields.includes(field)) {
                    delete req.body[field];
                }               
            });

            if(Object.keys(req.body).length === 0) {
                throw new Error(400, "At least one field must be provided");
            }

            return true;
        })
];

export const deleteSellerVariantByIdValidator = [
    param("sellerVariantId")
        .notEmpty().withMessage("Seller variant id is required").bail()
        .isInt({ gt: 0 }).withMessage("Seller variant id must be a positive integer").bail()
        .toInt(),
];