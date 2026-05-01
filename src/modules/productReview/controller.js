import { AppError } from "#utils/AppError.js";
import { upsertProductReview, upsertProductReviewSummary } from "./repository.js";
import { sellerVariantRepository } from "../sellers/repository.js";

const createOrUpdateProductReview = async (req, res) => {
    try {
        const { productVariantId, sellerId,  rating, review } = req.body;
        const user = req.user;

        const seller = await sellerVariantRepository.findSellerByUserId(user.id); 

        if (seller && seller.id === sellerId) {
            throw new AppError(403, "You cannot review your own product");
        }

        const { result, stats, breakdown } = await upsertProductReview(user.id, productVariantId, rating, review);
        
        const initialBreakdown = {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
        };

        const ratingBreakdown = breakdown.reduce((acc, item) => {
            const rating = Math.round(item.rating);
            if (rating >= 0 && rating <= 5) acc[rating] += item._count;
            return acc;
        }, initialBreakdown)

        await upsertProductReviewSummary(productVariantId, stats, ratingBreakdown);

        return res
        .status(200)
        .json({
            success: true,
            message: "Review upserted successfully",
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

export { createOrUpdateProductReview };