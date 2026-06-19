import express from "express";
import { AddToCart, getCart, RemoveFromCart } from "./controller.js";
import { addToCartValidator, removeFromCartValidator } from "./validator.js";
import { validate } from "#middlewares/validate.middleware.js";
import { requireAuth } from "#middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").get(requireAuth, getCart);
router.route("/add").post(requireAuth, addToCartValidator, validate, AddToCart);
router.route("/remove/:cartId").delete(requireAuth, removeFromCartValidator, validate, RemoveFromCart);

export default router;