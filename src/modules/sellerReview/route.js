import express from "express";
import { createOrUpdateSellerReview } from "./controller.js";
import { createOrUpdateSellerReviewValidator } from "./validator.js";
import { validate } from "#middlewares/validate.middleware.js";
import { requireAuth } from "#middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(
    requireAuth, 
    createOrUpdateSellerReviewValidator, 
    validate, 
    createOrUpdateSellerReview
);

export default router;