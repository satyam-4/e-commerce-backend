import { env } from "#config/env.js";
import argon2 from "argon2";
import crypto from "crypto";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "./controller";

export const encryptPassword = async (password) => {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
};

export const verifyPassword = async (password, hashedPassword) => {
    const result = await argon2.verify(hashedPassword, password);
    return result;
};

export const generateSessionToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

export const setSessionCookie = (res, rawToken, absoluteExp) => {
    const idleMs = env.SESSION_MAX_AGE;
    const remainingAbsoluteMs = new Date(absoluteExp).getTime - Date.now();

    res.cookie(SESSION_COOKIE_NAME, rawToken, {
        ...SESSION_COOKIE_OPTIONS,
        maxAge: Math.min(idleMs, remainingAbsoluteMs),
    });
};