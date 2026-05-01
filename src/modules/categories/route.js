import express from "express";
import { 
    getAllCategories, 
    getCategoryById,
    getSubcategoriesByCategoryId,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubcategoryByCategoryId,
} from "./controller.js";
import { 
    getCategoryByIdValidator, 
    getSubcategoriesByCategoryIdValidator,
    createCategoryValidator,
    updateCategoryValidator, 
    deleteCategoryValidator,
    createSubcategoryValidator,
} from "./validator.js";
import { requireAuth } from "#middlewares/auth.middleware.js";
import { checkRole } from "#middlewares/role.middleware.js";
import { validate } from "#middlewares/validate.middleware.js";

const router = express.Router();

router.route("/").get(getAllCategories);
router.route("/:categoryId").get(
    requireAuth, 
    getCategoryByIdValidator, 
    validate, 
    getCategoryById
);
router.route("/:categoryId/subcategory").get(
    getSubcategoriesByCategoryIdValidator, 
    validate, 
    getSubcategoriesByCategoryId
);
router.route("/:categoryId/subcategory").post(
    requireAuth, 
    checkRole(["SELLER", "ADMIN"]),
    createSubcategoryValidator,
    validate,
    createSubcategoryByCategoryId,
);
router.route("/").post(
    requireAuth,
    checkRole(["ADMIN", "SELLER"]), 
    createCategoryValidator,
    validate,
    createCategory
);
router.route("/:categoryId").put(
    requireAuth,
    checkRole(["ADMIN", "SELLER"]), 
    updateCategoryValidator,
    validate,
    updateCategory
);
router.route("/:categoryId").delete(
    requireAuth,
    checkRole(["ADMIN", "SELLER"]), 
    deleteCategoryValidator,
    validate,
    deleteCategory
);

export default router;