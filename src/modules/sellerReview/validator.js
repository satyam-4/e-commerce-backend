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
        .notEmpty().withMessage("Review text is required").bail()
        .isString().withMessage("Review must be a string").bail()
        .isLength({ min: 10, max: 1000 }).withMessage("Review must be between 10 and 1000 characters long").bail(),
];