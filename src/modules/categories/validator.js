import { param, body } from "express-validator";

export const getCategoryByIdValidator = [
    param("categoryId")
        .notEmpty().withMessage("Category id is required").bail()
        .isInt({ gt: 0 }).withMessage("Category id must be a positive integer").bail()
        .toInt(),
];

export const getSubcategoriesByCategoryIdValidator = [
    param("categoryId")
        .notEmpty().withMessage("Category id is required").bail()
        .isInt({ gt: 0 }).withMessage("Category id must be a positive integer").bail()
        .toInt(),
];

export const createCategoryValidator = [
    body("name")
        .notEmpty().withMessage("Category name is required").bail()
        .isString().withMessage("Category name must be string").bail()
        .isLength({ min: 3, max: 50}).withMessage("Category name must be between 3 and 50 characters"),

    body("description")
        .optional().bail()
        .isString().withMessage("Description must be a string").bail()
        .isLength({ min: 5, max: 100 }).withMessage("Description must be between 5 and 100 characters"),
];

export const createSubcategoryValidator = [
    param("categoryId")
        .notEmpty().withMessage("Category id is required").bail()
        .isInt({ gt: 0 }).withMessage("Category id must be a positive integer").bail()
        .toInt(),

    body("name")
        .notEmpty().withMessage("Subcategory name is required").bail()
        .isString().withMessage("Subcategory name must be a string").bail()
        .isLength({ min: 3, max: 50 }).withMessage("Subcategory name must be between 3 and 50 characters"),

    body("description")
        .optional()
        .isString().withMessage("Subcategory description must be a string").bail()
        .isLength({ min: 5, max: 100 }).withMessage("Subcategory description must be between 5 and 100 characters"),
];

export const updateCategoryValidator = [
    param("categoryId")
        .notEmpty().withMessage("Category id is required")
        .isInt({ gt: 0 }).withMessage("Category id must be a positive integer")
        .toInt(),

    body("name")
        .optional().bail()
        .isString().withMessage("Category name must be string").bail()
        .isLength({ min: 3, max: 50}).withMessage("Category name must be between 3 and 50 characters"),

    body("description")
        .optional().bail()
        .isString().withMessage("Description must be a string").bail()
        .isLength({ min: 5, max: 100 }).withMessage("Description must be between 5 and 100 characters"),

    body()
        .custom((_, { req }) => {
            const allowedFields = ["name", "description"];

            Object.keys(req?.body).forEach((field) => {
                if(!allowedFields.includes(field)) {
                    delete req.body[field];
                }
            });

            if(Object.keys(req?.body).length === 0) 
                throw new Error(400, "At least one field must be provided");
            
            return true;
        }),
];

export const deleteCategoryValidator = [
    param("categoryId")
        .notEmpty().withMessage("Category id is required").bail()
        .isInt({ gt: 0 }).withMessage("Category id must be a positive integer").bail()
        .toInt()
];