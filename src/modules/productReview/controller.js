import { upsertProductReviewAndSummary } from "./repository.js";

const createOrUpdateProductReview = async (req, res) => {
    const { productVariantId,  rating, review } = req.body;
    const { id: userId } = req.user;

    const result = await upsertProductReviewAndSummary(userId, productVariantId, rating, review);

    return res
    .status(200)
    .json({
        success: true,
        message: "Review upserted successfully",
        data: result
    });
};

export { createOrUpdateProductReview };