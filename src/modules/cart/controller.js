import { addProductToCart, removeProductFromCart } from "./repository.js";

const AddToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    console.log("quantity:", quantity);
    const product = await addProductToCart(productId, quantity, userId);

    return res
    .status(200)
    .json({
        success: true,
        message: "Product added to the cart",
        data: product
    });
};

const RemoveFromCart = async (req, res) => {
    const userId = req.user.id;
    const { id: productId } = req.params;

    const deletedProduct = await removeProductFromCart(userId, productId);

    return res
    .status(200)
    .json({
        success: true,
        message: "Product removed from cart",
        data: deletedProduct
    });
};

export {
    AddToCart,
    RemoveFromCart
};