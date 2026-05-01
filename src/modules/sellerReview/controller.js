import { AppError } from "#utils/AppError.js";
import { upsertSellerReview, upsertSellerReviewSummary } from "./repository.js";
import { sellerVariantRepository } from "../sellers/repository.js";

const createOrUpdateSellerReview = async (req, res) => {
    try {
        const { sellerId, rating, review } = req.body;
        const user = req.user;

        const seller = await sellerVariantRepository.findSellerByUserId(user.id);

        if (seller && (seller.id === sellerId)) {
            throw new AppError(403, "You cannot review yourself");
        }

        const { result, stats, breakdown } = await upsertSellerReview(user.id, sellerId, rate, review);
        let initialBreakdown = {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
        };

        const ratingBreakdown = breakdown.reduce((acc, item) => {
            const rate = Math.round(item.rating);
            if (rating >= 0 && rating <= 5) acc[rate] += item._count;
            return acc;
        }, initialBreakdown);

        await upsertSellerReviewSummary(sellerId, stats, ratingBreakdown);

        return res
        .status(200)
        .json({
            success: true,
            message: "Successfully upserted seller review",
            data: result
        });
    } catch (error) {
        console.log("Error:", error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, "Internal server error");
    }
};

export { createOrUpdateSellerReview };