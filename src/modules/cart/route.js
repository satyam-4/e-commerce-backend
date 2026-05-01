import express from "express";
import { AddToCart, RemoveFromCart } from "./controller.js";
import { addToCartValidator, removeFromCartValidator } from "./validator.js";
import { validate } from "#middlewares/validate.middleware.js";
import { requireAuth } from "#middlewares/auth.middleware.js";

const router = express.Router();

router.route("/add").post(requireAuth, addToCartValidator, validate, AddToCart);
router.route("/remove/:id").delete(requireAuth, removeFromCartValidator, validate, RemoveFromCart);

export default router;