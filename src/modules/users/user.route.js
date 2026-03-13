import express from "express";
import { becomeSeller, getMe } from "./user.controller.js";
import { requireAuth } from "#middlewares/auth.middleware.js";
import { becomeSellerValidator } from "./user.validator.js";
import { validate } from "#middlewares/validate.middleware.js";

const router = express.Router();

router.route("/become-seller").post(
    requireAuth, 
    becomeSellerValidator, 
    validate, 
    becomeSeller
);
router.route("/me").get(requireAuth, getMe);

export default router;