import express from "express";
import { 
    createProduct, 
    createProductVariant, 
    deleteProduct, 
    deleteProductVariant, 
    getProducts, 
    getProductsById, 
    updateProduct 
} from "./controller.js";
import { 
    createProductValidator, 
    getProductByIdValidator, 
    updateProductValidator, 
    deleteProductValidator, 
    createProductVariantValidator, 
    deleteProductVariantValidator} 
from "./validator.js";
import { validate } from "#middlewares/validate.middleware.js";
import { requireAuth } from "#middlewares/auth.middleware.js";
import { checkRole } from "#middlewares/role.middleware.js";

const router = express.Router();

router.route("/").get(getProducts);
router.route("/").post(
    requireAuth, 
    checkRole(["SELLER", "ADMIN"]), 
    createProductValidator, 
    validate, 
    createProduct
);
router.route("/:productId").delete(
    requireAuth, 
    checkRole(["SELLER", "ADMIN"]), 
    deleteProductValidator,
    validate,
    deleteProduct
);
router.route("/:productId/variants").post(
    requireAuth, 
    checkRole(["SELLER", "ADMIN"]), 
    createProductVariantValidator, 
    validate, 
    createProductVariant
);
router.route("/:productId/variants/:productVariantId").delete(
    requireAuth,
    checkRole(["SELLER", "ADMIN"]),
    deleteProductVariantValidator,
    validate,
    deleteProductVariant
);
router.route("/:id").get(
    requireAuth, 
    getProductByIdValidator, 
    validate, 
    getProductsById
);
router.route("/:id").patch(
    requireAuth, 
    checkRole(["SELLER", "ADMIN"]), 
    updateProductValidator, 
    validate, 
    updateProduct
);

export default router;