import { findSellerByUserId } from "#modules/sellers/repository.js";
import { AppError } from "#utils/AppError.js";

export const attachSeller = async (req, res, next) => {
    const {id: userId} = req.user;
    const seller = await findSellerByUserId(userId);

    if (!seller) {
        throw new AppError(404, "Seller not found");
    }

    req.seller = seller

    next();
}