import { body } from "express-validator";

export const becomeSellerValidator = [
    body("pickupAddress")
        .notEmpty().withMessage("Pickup address is required")
        .isString().withMessage("Pickup address must be a string")
        .isLength({ min: 10, max: 255 }).withMessage("Pickup address must be between 10 and 255 characters"),

    body("businessName")
        .notEmpty().withMessage("Business name is required")
        .isString().withMessage("Business name must be a string")
        .isLength({ min: 3, max: 100 }).withMessage("Business name must be between 3 and 100 characters"),

    body("gstNumber")
        .notEmpty().withMessage("GST number is required")
        .isString().withMessage("GST number must be a string")
        .matches(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/)
        .withMessage("Invalid GST number format"),

    body("bankAccountNumber")
        .notEmpty().withMessage("Bank account number is required")
        .isNumeric().withMessage("Bank account number must contain only numbers")
        .isLength({ min: 9, max: 18 }).withMessage("Bank account number must be between 9 and 18 digits"),

    body("ifscCode")
        .notEmpty().withMessage("IFSC code is required")
        .isString().withMessage("IFSC code must be a string")
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .withMessage("Invalid IFSC code format"),

    body("bankName")
        .notEmpty().withMessage("Bank name is required")
        .isString().withMessage("Bank name must be a string")
        .isLength({ min: 3, max: 100 }).withMessage("Bank name must be between 3 and 100 characters")
];