import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js";
import { queryBuilder } from "./service.js";

export const addProducts = async (name, description, subcategoryId) => {
    const subcategory = await prisma.subcategory.findUnique({
        where: { id: subcategoryId }
    });

    if (!subcategory) {
        throw new AppError(404, "Subcategory not found");
    }

    const product = await prisma.product.create({
        data: {
            name,
            description,
            subcategoryId: subcategoryId
        }
    });

    return product;
};

export const destroyProduct = async (productId) => {
    const deletedProduct = await prisma.product.delete({
        where: { id: productId }
    });

    return deletedProduct;
};

export const addProductVariant = async (productId, sku, attributes) => {
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product) {
        throw new AppError(404, "Product not found");
    }

    const productVariant = await prisma.productVariant.create({
        data: {
            sku: sku,
            productId: productId,
            attributes: attributes
        }
    });

    return productVariant;
};

export const destroyProductVariant = async (productId, productVariantId) => {
    const deletedProductVariant = await prisma.productVariant.delete({
        where: {
            id: productVariantId,
            productId: productId
        }
    });

    return deletedProductVariant;
};

export const findProducts = async (filters) => {
    const { where, orderBy, skip, take } = queryBuilder(filters);
    const { category, subcategory, ...restWhere } = where;

    const products = await prisma.product.findMany({
        where: {
            ...restWhere,
            ...(category || subcategory ? {
                subcategory: {
                    ...(subcategory ? { slug: subcategory } : {}),
                    ...(category ? { category: { slug: category } } : {})
                }
            } : {}),
            productVariants: {
                some: {
                    sellerVariants: {
                        some: {
                            stock: { gt: 0 }
                        }
                    }
                }
            }
        },
        orderBy,
        select: {
            id: true,
            name: true,
            createdAt: true,
            productVariants: {
                where: {
                    sellerVariants: {
                        some: {
                            stock: { gt: 0 }
                        }
                    }
                },
                select: {
                    id: true,
                    sku: true,
                    attributes: true,
                    sellerVariants: {
                        select: {
                            id: true,
                            sellerId: true,
                            price: true,
                            stock: true
                        }
                    }
                },
            }
        },
        skip: skip,
        take: take
    });

    return products;
};

export const getProductById = async (productId) => {
    if (!productId) return null;

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    return product;
};


export const updateProductById = async (productId, updateData) => {
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product) {
        throw new AppError(404, "Product not found");
    }

    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: updateData
    });

    return updatedProduct;
};