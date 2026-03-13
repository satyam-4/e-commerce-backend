import express from "express";
import { createOrUpdateProductReview } from "./controller.js";
import { createOrUpdateReviewValidator } from "./validator.js";
import { validate } from "#middlewares/validate.middleware.js";
import { requireAuth } from "#middlewares/auth.middleware.js";

const router = express();

router.post("/", requireAuth, createOrUpdateReviewValidator, validate, createOrUpdateProductReview);

export default router;