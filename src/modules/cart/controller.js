import { addSellerVariantToCart, removeSellerVariantFromCart } from "./repository.js";
import { getCartService } from "./service.js";

const AddToCart = async (req, res) => {
    const userId = req.user.id;
    const { sellerVariantId, quantity } = req.body;
    const cartItem = await addSellerVariantToCart(sellerVariantId, quantity, userId);

    return res
    .status(200)
    .json({
        success: true,
        message: "Seller variant added to the cart",
        data: cartItem
    });
};

const RemoveFromCart = async (req, res) => {
    const userId = req.user.id;
    const { cartId } = req.params;

    const deletedCartItem = await removeSellerVariantFromCart(userId, cartId);

    return res
    .status(200)
    .json({
        success: true,
        message: "Seller variant removed from cart",
        data: deletedCartItem
    });
};

const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cart = await getCartService(userId)

        return res
        .status(200)
        .json({
            success: true,
            message: cart.itemCount === 0 ? "Your cart is empty" : "Cart fetched successfully",
            data: cart
        });

    } catch (error) {
        next(error);
    }
};

export {
    AddToCart,
    RemoveFromCart,
    getCart
};