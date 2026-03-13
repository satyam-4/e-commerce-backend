import express from "express";
import { signinUser, signupUser } from "./controller.js";
import { sigininValidator, signupValidator } from "./validator.js";
import { validate } from "#middlewares/validate.middleware.js";

const router = express.Router();

router.route("/signin").post(sigininValidator, validate, signinUser);
router.route("/signup").post(signupValidator, validate, signupUser);

export default router;