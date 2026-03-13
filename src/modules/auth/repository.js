import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js";

const createNewUser = async (fullName, email, password, phone, address) => {
    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            password,
            phone,
            address
        }
    });
    return user;
}

const checkUserExistence = async (email, phone) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { phone }
            ]
        }
    });
    return user;
}

const getUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        return user;
    } catch (error) {
        throw new AppError(500, "Failed to fetch user");
    }
}

const getUserById = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        return user;
    } catch (error) {
        throw new AppError(500, "Failed to find user");
    }
}

const storeSessionToken = async (userId, hashedToken, ipAddress, userAgent, expiresAt, absoluteExp) => {
    try {
        return await prisma.session.create({
            data: {
                userId,
                sessionToken: hashedToken,
                ipAddress,
                userAgent,
                expiresAt,
                absoluteExp
            }
        });
    } catch (error) {
        throw new AppError(500, "Error while storing session token");
    }
}

const getSessionToken = async (sessionToken) => {
    try {
        const session = await prisma.session.findUnique({
            where: { sessionToken }
        });
        return session;
    } catch (error) {
        console.error("Prisma error:", error);
        throw new AppError(500, "Failed to get session");
    }
}

const destroySessionToken = async (sessionToken) => {
    try {
        await prisma.session.delete({
            where: { sessionToken }
        });
    } catch (error) {
        throw new AppError(500, "Failed to delete session")
    }
}

const refreshSessionExpiry = async (sessionToken, expiresAt) => {
    try {
        await prisma.session.update({
            where: { sessionToken },
            data: { expiresAt }
        });
    } catch (error) {
        throw new AppError(500, "Failed to refresh session")
    }
}

export {
    createNewUser,
    checkUserExistence,
    getUserByEmail,
    getUserById,
    storeSessionToken,
    getSessionToken,
    destroySessionToken,
    refreshSessionExpiry,
}