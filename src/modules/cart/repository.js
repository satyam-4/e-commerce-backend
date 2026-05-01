import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js"

export const addProductToCart = async (productId, quantity, userId) => {
    try {
        const product = await prisma.product.findFirst({
            where: { id: productId }
        })
        
        if(!product) {
            throw new AppError(404, "Product not found");
        }

        const cart = await prisma.cart.upsert({
            where: { userId: userId },
            update: {},
            create: { userId: userId }
        });

        const cartItem = await prisma.cartitem.create({
            data: {
                cartId: cart.id,
                productId: productId,
                quantity: quantity
            }
        });

        return cartItem;
    } catch (error) {
        if(error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, "Error while adding product to cart");
    }
}

export const removeProductFromCart = async (userId, productId) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: userId }
        });

        if(!cart) {
            throw new AppError(404, "Cart not found");
        }

        const cartId = cart.id;

        const cartItem = await prisma.cartitem.delete({
            where: {
                cartId_productId: {
                    cartId: cartId,
                    productId: productId
                }
            }
        });

        return cartItem;
    } catch (error) {
        if(error instanceof AppError) {
            throw error;
        }
        console.log("yo error aayo:", error)
        throw new AppError(500, "Error while removing product from cart")
    }
}