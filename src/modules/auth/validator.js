import { body } from "express-validator";

export const signupValidator = [
    body("fullName")
        .notEmpty().withMessage("Full name is required").bail()
        .isString().withMessage("Full name must be a string").bail()
        .isLength({ min: 3, max: 50}).withMessage("Full name must be between 3 and 50 characters"),

    body("email")
        .notEmpty().withMessage("Email is required").bail()
        .isString().withMessage("Email must be a string").bail()
        .isEmail().withMessage("Invalid email address").bail()
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Password is required").bail()
        .isString().withMessage("Password must be string").bail()
        .isLength({ min: 6, max: 12 }).withMessage("Password must be between 6 and 12 characters").bail()
        .matches(/[0-9]/).withMessage("Password must contain atleast one number").bail()
        .matches(/[A-Z]/).withMessage("Password must contain atleast one uppercase letter"),

    body("phone")
        .notEmpty().withMessage("Phone is required").bail()
        .isString().withMessage("Phone number must be a string").bail()
        .isMobilePhone().withMessage("Invalid phone number"),

    body("address")
        .notEmpty().withMessage("Address is required").bail()
        .isString().withMessage("Address must be a string").bail()
        .isLength({ max: 100 }).withMessage("Address must not exceed 100 characters"),
];

export const sigininValidator = [
    body("email")
        .notEmpty().withMessage("Email is required").bail()
        .isString().withMessage("Email must be a string").bail()
        .isEmail().withMessage("Invalid email address").bail()
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Password is required").bail()
        .isString().withMessage("Password must be a string"),
];