import { body } from "express-validator";

export const createOrUpdateReviewValidator = [
    body("productVariantId")
        .notEmpty().withMessage("Product variant Id is required").bail()
        .isInt({ gt: 0 }).withMessage("Product variant Id must be a positive integer").bail()
        .toInt(),

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