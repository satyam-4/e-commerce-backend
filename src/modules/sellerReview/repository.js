import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js";

const upsertSellerReviewAndSummary = async (userId, sellerId, rating, review) => {
    return await prisma.$transaction(async (tx) => {
        const result = await tx.sellerReview.upsert({
            where: { sellerId_userId: { sellerId, userId } },
            update: { rating, review },
            create: { userId, sellerId, rating, review }
        });

        const stats = await tx.sellerReview.aggregate({
            where: { sellerId },
            _avg: { rating: true },
            _count: true
        });

        const breakdown = await tx.sellerReview.groupBy({
            by: ['rating'],
            where: { sellerId },
            _count: true
        });

        let initialBreakdown = {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
        };

        const ratingBreakdown = breakdown.reduce((acc, item) => {
            const rating = Math.round(item.rating);
            if (rating >= 0 && rating <= 5) acc[rate] += item._count;
            return acc;
        }, initialBreakdown);

        
        await tx.sellerReviewSummary.upsert({
            where: { sellerId },
            update: { 
                sellerId,
                averageRating: stats._avg.rating || 0,
                totalReviews: stats._count,
                ratingBreakdown
            },
            create: { 
                sellerId,
                averageRating: stats._avg.rating || 0,
                totalReviews: stats._count,
                ratingBreakdown
            }
        });

        return result;
    });

};

export { upsertSellerReviewAndSummary };