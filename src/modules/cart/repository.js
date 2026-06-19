import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js"

const addSellerVariantToCart = async (sellerVariantId, quantity, userId) => {
    try {
        const sellerVariant = await prisma.sellerVariant.findFirst({
            where: { id: sellerVariantId }
        })
        
        if(!sellerVariant) {
            throw new AppError(404, "Seller variant not found");
        }

        if (sellerVariant?.stock <= 0) {
            throw new AppError(400, "Product currently out of stock in this seller variant")
        }

        if (sellerVariant?.stock < quantity) {
            throw new AppError(400, `Only ${sellerVariant?.stock} units are available`);
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

    } catch (error) {
        console.error("REAL ERROR:", error);
        if(error instanceof AppError) throw error;
        throw new AppError(500, "Error while adding to cart");
    }
}

const removeSellerVariantFromCart = async (userId, cartId) => {
    try {
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
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError(500, "Error while removing cart item")
    }
}

const getAllCartItemsByUser = async (userId) => {
    try {
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
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError(500, "Error while fetching all carts")
    }
}

export {
    addSellerVariantToCart,
    removeSellerVariantFromCart,
    getAllCartItemsByUser,
}