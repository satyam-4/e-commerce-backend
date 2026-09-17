import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js"

const addSellerVariantToCart = async (sellerVariantId, quantity, userId) => {
    const sellerVariant = await prisma.sellerVariant.findFirst({
        where: { id: sellerVariantId }
    });

    if (!sellerVariant) {
        throw new AppError(404, "Seller variant not found");
    }

    if (sellerVariant.stock <= 0) {
        throw new AppError(400, "Product currently out of stock in this seller variant");
    }

    const existingCartItem = await prisma.cart.findUnique({
        where: {
            userId_sellerVariantId: { userId, sellerVariantId }
        }
    });

    const requestedTotal = (existingCartItem?.quantity ?? 0) + quantity;

    if (requestedTotal > sellerVariant.stock) {
        throw new AppError(400, `Only ${sellerVariant.stock} units are available`);
    }

    const cartItem = await prisma.cart.upsert({
        where: {
            userId_sellerVariantId: { userId, sellerVariantId }
        },
        update: {
            quantity: { increment: quantity }
        },
        create: {
            sellerVariantId,
            quantity,
            userId
        }
    });

    return cartItem;
}

const removeSellerVariantFromCart = async (userId, cartId) => {
    const cart = await prisma.cart.findFirst({
        where: { 
            id: cartId,
            userId: userId 
        }
    });

    if(!cart) {
        throw new AppError(404, "Cart not found");
    }

    const deletedCartItem = await prisma.cart.delete({
        where: { id: cartId }
    });

    return deletedCartItem;
}

const getAllCartItemsByUser = async (userId) => {
    const cartItems = await prisma.cart.findMany({
        where: { userId },
        select: {
            id: true,
            quantity: true,
            sellerVariant: {
                select: {
                    id: true,
                    price: true,
                    stock: true,
                    seller: {
                        select: { businessName: true }
                    },
                    productVariant: {
                        select: {
                            sku: true,
                            attributes: true,
                            product: {
                                select: { name: true, description: true }
                            }
                        }
                    }
                }
            }
        }
    });

    return cartItems;
}

export {
    addSellerVariantToCart,
    removeSellerVariantFromCart,
    getAllCartItemsByUser,
}