import { AppError } from "#utils/AppError.js";
import { destroySessionToken, getSessionToken, getUserByEmail, getUserById, refreshSessionExpiry } from "#modules/auth/repository.js";

// 7 days
const SLIDING_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000

export const requireAuth = async (req, res, next) => {
    try {
        const sessionToken = req.cookies?.sid;
    
        if (!sessionToken) {
            throw new AppError(401, "Unauthorized request");
        }
        
        const session = await getSessionToken(sessionToken);

        if (!session) {
            throw new AppError(401, "Invalid or expired session");
        }

        const now = new Date();
        if (session.absoluteExp && (now > session.absoluteExp)) {
            await destroySessionToken(sessionToken);
            throw new AppError(401, "Session expired");
        }

        if (session.expiresAt && (now > session.expiresAt)) {
            await destroySessionToken(sessionToken);
            throw new AppError(401, "Session expired");
        }

        const newExpiresAt = new Date(Date.now() + SLIDING_EXPIRY_MS);
        await refreshSessionExpiry(sessionToken, newExpiresAt);

        const user = await getUserById(session.userId);
        req.user = user;
        
        next();
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(500, "Internal server error");
    }
}