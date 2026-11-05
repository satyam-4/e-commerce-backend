import express from "express";
import { signinUser, signoutUser, signupUser } from "./controller.js";
import { sigininValidator, signupValidator } from "./validator.js";
import { validate } from "#middlewares/validate.middleware.js";
import { requireAuth } from "#middlewares/auth.middleware.js";
import { loginEmailLimiter, loginIpLimiter } from "#middlewares/rateLimit.middleware.js";

const router = express.Router();

router
 .route("/signin")
 .post(
    loginIpLimiter,
    loginEmailLimiter,
    sigininValidator, 
    validate, 
    signinUser
);

router
 .route("/signup")
 .post(signupValidator, validate, signupUser);

 router
  .route("/signout")
  .post(requireAuth, signoutUser);

export default router;