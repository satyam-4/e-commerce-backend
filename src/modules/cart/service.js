import { getAllCartItemsByUser } from "./repository.js";

const getCartService = async (userId) => {
    const cartItems = await getAllCartItemsByUser(userId);

    const total = cartItems.reduce((sum, item) => {
        return sum + item.sellerVariant.price * item.quantity;
    }, 0);

    return {
        items: cartItems,
        itemCount: cartItems.length,
        total
    };
};

export {
    getCartService
};