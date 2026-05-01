import { AppError } from "#utils/AppError.js";
import { 
    addProducts, 
    addProductVariant, 
    destroyProduct, 
    destroyProductVariant, 
    findProducts, 
    getProductById, 
    updateProductById 
} from "./repository.js";

const getProducts = async (req, res) => {
    const filters = req.query;
    const products = await findProducts(filters);
    
    return res
    .status(200)
    .json({
        success: true,
        message: "Products fetched successfully",
        data: products
    });
};

const getProductsById = async (req, res) => {
    const { id: productId } = req.params;
    const product = await getProductById(productId);

    if(!product) {
        throw new AppError(404, "Product not found");
    }

    return res
    .status(200)
    .json({
        success: true,
        message: "Product fetched successfully",
        data: product
    });
};

const createProduct = async (req, res) => {
    const { name, description, subcategoryId } = req.body;
    
    const product = await addProducts(name, description, subcategoryId);

    return res
    .status(200)
    .json({
        success: true,
        message: "Product created sucessfully",
        product: product
    });
};

const updateProduct = async (req, res) => {
    const { id: productId } = req.params;
    const userId = req.user.id;
    const dataToUpdate = req.body;

    const updatedProduct = await updateProductById(productId, userId, dataToUpdate);

    return res
    .status(200)
    .json({
        success: true,
        message: "Successfully updated the product",
        data: updatedProduct
    });
};

const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    const deletedProduct = await destroyProduct(productId);

    return res
    .status(200)
    .json({
        success: true,
        message: "Successfully deleted the product",
        data: deletedProduct
    });
};

const createProductVariant = async (req, res) => {
    const productId = req.params.productId;
    const { sku, attributes } = req.body;

    const productVariant = await addProductVariant(productId, sku, attributes);

    return res
    .status(201)
    .json({
        success: true,
        message: "Product variant created successfully",
        data: productVariant
    });
};

const deleteProductVariant = async (req, res) => {
    const { productId, productVariantId } = req.params;
    
    console.log(productId, variantId)

    const deletedProductVariant = await destroyProductVariant(productId, productVariantId);

    return res
    .status(200)
    .json({
        success: true,
        message: "Deleted product variant successfully",
        data: deletedProductVariant
    });
};

export {
    createProduct,
    deleteProduct,
    createProductVariant,
    deleteProductVariant,
    getProducts,
    getProductsById,
    updateProduct,
};