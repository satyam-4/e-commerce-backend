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
    const user = await prisma.user.findUnique({
        where: {
            email
        },
        omit: {
            password: false
        }
    });
    return user;
}

const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    return user;
}

const storeSessionToken = async (userId, hashedToken, ipAddress, userAgent, expiresAt, absoluteExp) => {
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
}

const getSessionToken = async (sessionToken) => {
    const session = await prisma.session.findUnique({
        where: { sessionToken }
    });
    return session;
}

const destroySessionToken = async (sessionToken) => {
    await prisma.session.delete({
        where: { sessionToken }
    });
}

const refreshSessionExpiry = async (sessionToken, expiresAt) => {
    await prisma.session.update({
        where: { sessionToken },
        data: { expiresAt }
    });
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