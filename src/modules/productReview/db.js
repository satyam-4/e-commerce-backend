import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js";

const upsertProductReview = async (userId, productVariantId, rating, review) => {
    try {
        const result = await prisma.productReview.upsert({
            where: { userId_productVariantId: { userId, productVariantId } },
            update: { rating, review },
            create: { userId, productVariantId, rating, review }
        });

        const stats = await prisma.productReview.aggregate({
            where: { productVariantId },
            _avg: { rating: true },
            _count: true
        });

        const breakdown = await prisma.productReview.groupBy({
            by: ['rating'],
            where: { productVariantId },
            _count: true
        });

        return { result, stats, breakdown };
    } catch (error) {
        console.log("Prisma error:", error);
        throw new AppError(500, "Error while updating product review");
    }
};

const upsertProductReviewSummary = async (productVariantId, stats, breakdown) => {
    try {
        await prisma.productReviewSummary.upsert({
            where: { productVariantId },
            update: {
                averageRating: stats._avg.rating || 0,
                totalReviews: stats._count,
                ratingBreakdown: breakdown
            },
            create: {
                productVariantId,
                averageRating: stats._avg.rating || 0,
                totalReviews: stats._count,
                ratingBreakdown: breakdown
            }
        });
    } catch (error) {
        console.log("Prisma error:", error);
        throw new AppError(500, "Error while updating product review summary");
    }
};

export { upsertProductReview, upsertProductReviewSummary };