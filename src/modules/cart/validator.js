import { body, param } from "express-validator";

export const addToCartValidator = [
    body("sellerVariantId")
        .notEmpty().withMessage("Seller Variant ID is required").bail()
        .isInt({ gt: 0 }).withMessage("Seller Variant ID must be a positive integer").bail()
        .toInt(),

    body("quantity")
        .optional()
        .isInt({ gt: 0 }).withMessage("Quantity must be a positive number").bail()
        .toInt(),
];

export const removeFromCartValidator = [
    param("cartId")
        .isInt({ gt: 0 }).withMessage("Cart ID must be a positive integer")
        .toInt(),
];