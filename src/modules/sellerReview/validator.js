import { body } from "express-validator";

export const createOrUpdateSellerReviewValidator = [
    body("sellerId")
        .notEmpty().withMessage("Seller ID is required").bail()
        .isUUID().withMessage("Seller ID must be a valid UUID").bail(),

    body("rating")
        .notEmpty().withMessage("Rating is required").bail()
        .isFloat({ min: 1, max: 5 }).withMessage("Rating must be an integer between 1 and 5").bail()
        .toFloat(),

    body("review")
        .optional({ nullable: true })
        .trim()
        .customSanitizer((value) => (value === "" ? null : value))
        .optional({ nullable: true })
        .isString().withMessage("Review must be a string").bail()
        .isLength({ max: 1000 }).withMessage("Review must be at most 1000 characters long").bail(),
];