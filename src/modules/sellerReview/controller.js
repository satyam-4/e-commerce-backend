import { AppError } from "#utils/AppError.js";
import { upsertSellerReviewAndSummary } from "./repository.js";
import { findSellerByUserId } from "../sellers/repository.js";

const createOrUpdateSellerReview = async (req, res) => {
    const { sellerId, rating, review } = req.body;
    const { id: userId } = req.user;

    const seller = await findSellerByUserId(userId);

    if (seller && (seller?.id === sellerId)) {
        throw new AppError(403, "You cannot review yourself");
    }

    const result = await upsertSellerReviewAndSummary(userId, sellerId, rating, review);

    return res
    .status(200)
    .json({
        success: true,
        message: "Successfully upserted seller review",
        data: result
    });
};

export { createOrUpdateSellerReview };