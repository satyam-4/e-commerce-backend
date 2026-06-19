import argon2 from "argon2";
import crypto from "crypto";

export const encryptPassword = async (password) => {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
}

export const verifyPassword = async (password, hashedPassword) => {
    const result = await argon2.verify(hashedPassword, password);
    return result;
}

export const generateSessionToken = async () => {
    return crypto.randomBytes(32).toString("hex");
}

export const hashToken = async (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}

// export const generateAccessToken = async (payload) => {
//     try {
//         return jwt.sign(
//             { payload },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
//         );
//     } catch (error) {
//         throw new Error("Error while generating access token");
//     }
// }

// export const generateRefreshToken = async (payload) => {
//     try {
//         return jwt.sign(
//             { payload },
//             process.env.REFRESH_TOKEN_SECRET,
//             { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
//         );
//     } catch (error) {
//         throw new Error("Error while generating refresh token");
//     }
// }