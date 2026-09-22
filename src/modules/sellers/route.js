import express from "express";
import { requireAuth } from "#middlewares/auth.middleware.js";
import { checkRole } from "#middlewares/role.middleware.js";
import {
    createSellerVariantValidator,
    getSellerVariantByIdValidator,
    updateSellerVariantByIdValidator,
    deleteSellerVariantByIdValidator,
} from "./validator.js"
import { validate } from "#middlewares/validate.middleware.js";
import { 
    createSellerVariant,
    deleteSellerVariantById,
    getAllSellerVariant,
    getSellerVariantByID,
    updateSellerVariantById,
} from "./controller.js";
import { attachSeller } from "#middlewares/attachSeller.middleware.js";

const router = express.Router();

router.route("/seller-variant").post(
    requireAuth,
    checkRole(["SELLER"]),
    attachSeller,
    createSellerVariantValidator,
    validate,
    createSellerVariant
);
router.route("/seller-variant").get(
    requireAuth,
    checkRole(["SELLER"]),
    attachSeller,
    getAllSellerVariant
);
router.route("/seller-variant/:sellerVariantId").get(
    requireAuth,
    checkRole(["SELLER"]),
    attachSeller,
    getSellerVariantByIdValidator,
    validate,
    getSellerVariantByID
);
router.route("/seller-variant/:sellerVariantId").put(
    requireAuth,
    checkRole(["SELLER"]),
    attachSeller,
    updateSellerVariantByIdValidator,
    validate,
    updateSellerVariantById
);
router.route("/seller-variant/:sellerVariantId").delete(
    requireAuth,
    checkRole(["SELLER"]),
    attachSeller,
    deleteSellerVariantByIdValidator,
    validate,
    deleteSellerVariantById
);

export default router;