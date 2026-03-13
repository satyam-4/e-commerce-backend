import { checkUserExistence, createNewUser, getUserByEmail, storeSessionToken } from "./repository.js";
import { encryptPassword, generateSessionToken, hashToken, verifyPassword } from "./service.js";
import { AppError } from "#utils/AppError.js";

const { SESSION_MAX_AGE, SESSION_ABSOLUTE_MAX_AGE } = process.env;

const SLIDING_MS = parseInt(SESSION_MAX_AGE || "604800000");
const ABSOLUTE_MS = parseInt(SESSION_ABSOLUTE_MAX_AGE || "2592000000");

const signupUser = async (req, res) => {
    const { fullName, email, password, phone, address } = req.body;
    const userExists = await checkUserExistence(email, phone);

    if (userExists) {
        throw new AppError(409, "User already exists");
    }

    const hashedPassword = await encryptPassword(password);
    const user = await createNewUser(fullName, email, hashedPassword, phone, address);
    return res
    .status(201)
    .json({
        success: true,
        user,
        message: "User created successfully"
    });
};

const signinUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    if (!user) {
        throw new AppError(404, "User does not exist");
    } 

    const hashedPassword = user.password;
    
    if (!(await verifyPassword(password, hashedPassword))) {
        throw new AppError(400, "Incorrect password");
    }

    const rawToken = await generateSessionToken();
    const hashedToken = await hashToken(rawToken);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + SLIDING_MS);
    const absoluteExp = new Date(now.getTime() + ABSOLUTE_MS);

    await storeSessionToken(user.id, hashedToken, ipAddress, userAgent, expiresAt, absoluteExp);

    return res 
    .status(200)
    .cookie("sid", hashedToken, {
        httpOnly: true,
        maxAge: SESSION_ABSOLUTE_MAX_AGE
    })
    .json({
        success: true,
        message: "User logged in successfully",
        data: user
    });
};

export {
    signinUser,
    signupUser
};