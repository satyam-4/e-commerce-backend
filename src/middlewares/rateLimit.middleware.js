import rateLimit from "express-rate-limit";
import { AppError } from "#utils/AppError.js";

const tooMany = (req, res, next) =>
  next(new AppError(429, "Too many login attempts. Try again later."));

export const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,     
  limit: 20,                    
  standardHeaders: "draft-7",    
  legacyHeaders: false,
  skipSuccessfulRequests: true, 
  handler: tooMany,
});

export const loginEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,                      
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => String(req.body?.email ?? "").trim().toLowerCase(),
  handler: tooMany,
});