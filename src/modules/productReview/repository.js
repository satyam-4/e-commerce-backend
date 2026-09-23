import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js";

const upsertProductReviewAndSummary = async (userId, productVariantId, rating, review) => {
    return await prisma.$transaction(async (tx) => {
        const result = await tx.productReview.upsert({
            where: { userId_productVariantId: { userId, productVariantId } },
            update: { rating, review },
            create: { userId, productVariantId, rating, review }
        });

        const stats = await tx.productReview.aggregate({
            where: { productVariantId },
            _avg: { rating: true },
            _count: true
        });

        const breakdown = await tx.productReview.groupBy({
            by: ['rating'],
            where: { productVariantId },
            _count: true
        });

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

        await tx.productReviewSummary.upsert({
            where: { productVariantId },
            update: {
                averageRating: stats._avg.rating || 0,
                totalReviews: stats._count,
                ratingBreakdown
            },
            create: {
                productVariantId,
                averageRating: stats._avg.rating || 0,
                totalReviews: stats._count,
                ratingBreakdown
            }
        });

        return result;
    });
};

export { upsertProductReviewAndSummary };