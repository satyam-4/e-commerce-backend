import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js";

const upsertSellerReview = async (userId, sellerId, rating, review) => {
    try {
        const result = await prisma.sellerReview.upsert({
            where: { sellerId_userId: { sellerId, userId } },
            update: { rating, review },
            create: { userId, sellerId, rating, review }
        });

        const stats = await prisma.sellerReview.aggregate({
            where: { sellerId },
            _avg: { rating: true },
            _count: true
        });

        const breakdown = await prisma.sellerReview.groupBy({
            by: ['rating'],
            where: { sellerId },
            _count: true
        });
        return { result, stats, breakdown };
    } catch (error) {
        console.log("Prisma error:", error);
        throw new AppError(500, "Error while upserting seller review");
    }
};

const upsertSellerReviewSummary = async (sellerId, stats, ratingBreakdown) => {
    try {
        await prisma.sellerReviewSummary.upsert({
            where: { sellerId },
            update: { 
                sellerId,
                averageRating: stats._avg.rating,
                totalReviews: stats._count,
                ratingBreakdown
            },
            create: { 
                sellerId,
                averageRating: stats._avg.rating,
                totalReviews: stats._count,
                ratingBreakdown
            }
        });
    } catch (error) {
        console.log("Prisma error:", error);
        throw new AppError(500, "Error while upserting seller review summary");
    }
};

export { upsertSellerReview, upsertSellerReviewSummary };