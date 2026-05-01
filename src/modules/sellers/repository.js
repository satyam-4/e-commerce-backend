import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js"

async function findSellerByUserId(userId) {
    try {
        const seller = await prisma.seller.findUnique({
            where: { userId: userId }
        });

        return seller;
    } catch (error) {
        console.log("error:", error)
        throw new AppError(500, "Internal server error while finding seller");
    }
}

async function getProductVariantByProductVariantId(ProductVariantId) {
    try {
        const ProductVariant = await prisma.ProductVariant.findUnique({
            where: { id: ProductVariantId }
        });

        return ProductVariant;
    } catch (error) {
        throw new AppError(500, "Internal server error while fetching product variant");
    }
}

async function findSellerVariantByProductVariantIdAndSellerId(ProductVariantId, sellerId) {
    try {
        const sellerVariant = await prisma.sellerVariant.findUnique({
            where: {
                productVariantId_sellerId: {
                    productVariantId: ProductVariantId,
                    sellerId: sellerId
                }
            }
        });

        return sellerVariant;
    } catch (error) {
        console.log("err:", error)
        throw new AppError(500, "Internal server error while finding seller variant")        ;
    }
}

async function addSellerVariant(productVariantId, sellerId, price, stock) {
    try {
        const sellerVariant = await prisma.sellerVariant.create({
            data: {
                sellerId: sellerId,
                productVariantId: productVariantId,
                price: price,
                stock: stock
            }
        });

        return sellerVariant;
    } catch (error) {
        throw new AppError(500, "Internal server error while adding seller variant");
    }
}   

async function findSellerVariantsBySellerId(sellerId) {
    try {
        const sellerVariants = await prisma.sellerVariant.findMany({
            where: { sellerId: sellerId }
        });

        return sellerVariants;
    } catch (error) {
        throw new AppError(500, "Internal server error while finding seller variants");
    }
}

async function findSellerVariantBySellerVariantId(sellerVariantId) {
    try {
        const sellerVariant = await prisma.sellerVariant.findUnique({
            where: { id: sellerVariantId }
        });

        return sellerVariant;
    } catch (error) {
        throw new AppError(500, "Internal server error while finding seller variant");
    }
}

async function updateSellerVariant(sellerVariantId, updateData) {
    try {
        const updatedSellerVariant = await prisma.sellerVariant.update({
            where: { id: sellerVariantId },
            data: updateData
        });

        return updatedSellerVariant;
    } catch (error) {
        throw new AppError(500, "Internal server error while updating seller variant");
    }
}

async function deletedSellerVariant(sellerVariantId) {
    try {
        const deletedSellerVariant = await prisma.sellerVariant.delete({
            where: { id: sellerVariantId }
        });

        return deletedSellerVariant;
    } catch (error) {
        throw new AppError(500, "Internal server error while deleting seller variant");
    }
}

export const sellerVariantRepository = {
    findSellerByUserId,
    getProductVariantByProductVariantId,
    findSellerVariantByProductVariantIdAndSellerId,
    addSellerVariant,
    findSellerVariantsBySellerId,
    findSellerVariantBySellerVariantId,
    updateSellerVariant,
    deletedSellerVariant,
}