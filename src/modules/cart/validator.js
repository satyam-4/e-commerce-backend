import { body, param } from "express-validator";

export const addToCartValidator = [
    body("productId")
        .notEmpty().withMessage("Product ID is required").bail()
        .isInt({ gt: 0 }).withMessage("Product ID must be a positive integer").bail()
        .toInt(),

    body("quantity")
        .optional()
        .isInt({ gt: 0 }).withMessage("Quantity must be a positive number").bail()
        .toInt(),
];

export const removeFromCartValidator = [
    param("id")
        .isInt({ gt: 0 }).withMessage("Product ID must be a positive integer")
        .toInt(),
];