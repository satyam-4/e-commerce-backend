import { body, param } from "express-validator";

export const getSubcategoryByIdValidator = [
    param("subcategoryId")
        .notEmpty().withMessage("Subcategory id is required")
        .isInt({ gt: 0 }).withMessage("Subcategory id must be a positive integer")
        .toInt(),
];

export const updateSubcategoryValidator = [
    param("subcategoryId")
        .notEmpty().withMessage("Subcategory id is required")
        .isInt({ gt: 0 }).withMessage("Subcategory id must be a positive integer")
        .toInt(),
    
    body("name")
        .optional()
        .isString().withMessage("Subcategory name must be a string").bail()
        .isLength({ min: 3, max: 50 }).withMessage("Subcategory name must be between 3 and 50 characters"),

    body("description")
        .optional()
        .isString().withMessage("Subcategory description must be a string").bail()
        .isLength({ min: 5, max: 100 }).withMessage("Subcategory description must be between 5 and 100 characters"),

    body()
    .custom((_, { req }) => {
        const allowedFields = ["name", "description"];
        Object.keys(req.body).forEach((field) => {
            if(!allowedFields.includes(field)) {
                delete req.body[field];
            }
        });

        if(Object.keys(req.body).length === 0) {
            throw new Error(400, "Atleast one field must be provided");
        }

        return true;
    })
];

export const deleteSubcategoryValidator = [
    param("subcategoryId")
        .notEmpty().withMessage("Subcategory id is required")
        .isInt({ gt: 0 }).withMessage("Subcategory id must be a positive integer")
        .toInt(),
];

export const getProductsBySubcategoryIdValidator = [
    param("subcategoryId")
        .notEmpty().withMessage("Subcategory id is required")
        .isInt({ gt: 0 }).withMessage("Subcategory id must be a positive integer")
        .toInt(),
];