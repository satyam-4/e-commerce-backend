import { AppError } from "#utils/AppError.js";
import { destroySessionToken, getSessionToken, getUserByEmail, getUserById, refreshSessionExpiry } from "#modules/auth/repository.js";
import { SESSION_COOKIE_OPTIONS, SESSION_COOKIE_NAME } from "#modules/auth/controller.js";
import { env } from "#config/env.js";
import { hashToken } from "#modules/auth/service.js";

export const requireAuth = async (req, res, next) => {
    const rawToken = req.cookies?.[SESSION_COOKIE_NAME];

    if (!rawToken || typeof rawToken !== "string") {
        throw new AppError(401, "Unauthorized request");
    }

    const hashedToken = hashToken(rawToken);
    const session = await getSessionToken(hashedToken);

    if (!session) {
        res.clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);
        throw new AppError(401, "Invalid or expired session");
    }

    const now = new Date();
    if (now > session.absoluteExp || now > session.expiresAt) {
        await destroySessionToken(sessionToken);
        res.clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);
        throw new AppError(401, "Session expired");
    }

    const newExpiresAt = new Date(Date.now() + env.SESSION_MAX_AGE);
    await refreshSessionExpiry(sessionToken, newExpiresAt);

    const user = await getUserById(session.userId);
    req.user = user;
    
    next();
}