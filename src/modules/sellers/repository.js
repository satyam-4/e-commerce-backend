import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js"

async function findSellerByUserId(userId) {
    const seller = await prisma.seller.findUnique({
        where: { userId: userId }
    });

    return seller;
};

async function getProductVariantByProductVariantId(productVariantId) {
    const productVariant = await prisma.productVariant.findUnique({
        where: { id: productVariant }
    });

    return productVariant;
};

async function findSellerVariantByProductVariantIdAndSellerId(ProductVariantId, sellerId) {
    const sellerVariant = await prisma.sellerVariant.findUnique({
        where: {
            productVariantId_sellerId: {
                productVariantId: ProductVariantId,
                sellerId: sellerId
            }
        }
    });

    return sellerVariant;
};

async function addSellerVariant(productVariantId, sellerId, price, stock) {
    const sellerVariant = await prisma.sellerVariant.create({
        data: {
            sellerId: sellerId,
            productVariantId: productVariantId,
            price: price,
            stock: stock
        }
    });

    return sellerVariant;
};

async function findSellerVariantsBySellerId(sellerId) {
    const sellerVariants = await prisma.sellerVariant.findMany({
        where: { sellerId: sellerId }
    });

    return sellerVariants;
};

async function findSellerVariantBySellerVariantId(sellerVariantId, sellerId) {
    const sellerVariant = await prisma.sellerVariant.findUnique({
        where: { 
            id: sellerVariantId,
            sellerId
        }
    });

    return sellerVariant;
};

async function updateSellerVariant(sellerId, sellerVariantId, updateData) {
    const updatedSellerVariant = await prisma.sellerVariant.update({
        where: { id: sellerVariantId, sellerId },
        data: updateData
    });

    return updatedSellerVariant;
};

async function deleteSellerVariant(sellerVariantId, sellerId) {
    const deletedSellerVariant = await prisma.sellerVariant.delete({
        where: { id: sellerVariantId, sellerId }
    });

    return deletedSellerVariant;
};

export {
    findSellerByUserId,
    getProductVariantByProductVariantId,
    findSellerVariantByProductVariantIdAndSellerId,
    addSellerVariant,
    findSellerVariantsBySellerId,
    findSellerVariantBySellerVariantId,
    updateSellerVariant,
    deleteSellerVariant,
};