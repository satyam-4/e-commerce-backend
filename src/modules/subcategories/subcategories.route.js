import express from "express";
import { 
    deleteSubcategory, 
    getAllSubcategories, 
    getProductsBySubcategoryId, 
    getSubcategoryById, 
    updateSubcategory } 
from "./subcategories.controller.js";
import { 
    deleteSubcategoryValidator,
    getProductsBySubcategoryIdValidator,
    getSubcategoryByIdValidator,
    updateSubcategoryValidator,
} from "./subcategories.validator.js";
import { requireAuth } from "#middlewares/auth.middleware.js";
import { checkRole } from "#middlewares/role.middleware.js";
import { validate } from "#middlewares/validate.middleware.js";

const router = express.Router();

router.route("/").get(getAllSubcategories);
router.route("/:subcategoryId").get(
    requireAuth,
    getSubcategoryByIdValidator,
    validate,
    getSubcategoryById
);
router.route("/:subcategoryId/products").get(
    requireAuth,
    getProductsBySubcategoryIdValidator,
    validate,
    getProductsBySubcategoryId
);
router.route("/:subcategoryId").put(
    requireAuth,
    checkRole(["ADMIN", "SELLER"]),
    updateSubcategoryValidator,
    validate,
    updateSubcategory
);
router.route("/:subcategoryId").delete(
    requireAuth,
    checkRole(["ADMIN", "SELLER"]),
    deleteSubcategoryValidator,
    validate,
    deleteSubcategory
);

export default router;