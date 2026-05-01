import { AppError } from "#utils/AppError.js";
import { createNewSeller } from "./repository.js";

const becomeSeller = async (req, res) => {
    const userId = req.user.id;
    const { pickupAddress, businessName, gstNumber, bankAccountNumber, ifscCode, bankName } = req.body;

    if(req.user.role === "seller") {
        throw new AppError(400, "You are already a seller");
    }

    const seller = await createNewSeller(userId, pickupAddress, businessName, gstNumber, bankAccountNumber, ifscCode, bankName);

    return res
    .status(200)
    .json({
        success: true,
        message: "You are a seller now",
        data: seller
    });
};

const getMe = async (req, res) => {
    const user = req.user;
    return res
    .status(200)
    .json({
        user
    });
};

export {
    becomeSeller,
    getMe
};