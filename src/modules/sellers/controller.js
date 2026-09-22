import { AppError } from "#utils/AppError.js";
import {     
    findSellerByUserId,
    getProductVariantByProductVariantId,
    findSellerVariantByProductVariantIdAndSellerId,
    addSellerVariant,
    findSellerVariantsBySellerId,
    findSellerVariantBySellerVariantId,
    updateSellerVariant,
    deleteSellerVariant 
} from "./repository.js";

const createSellerVariant = async (req, res) => {
    const { productVariantId, price, stock } = req.body;
    const { id: sellerId } = req.user?.seller;

    const productVariant = await getProductVariantByProductVariantId(productVariantId);

    if(!productVariant) {
        throw new AppError(404, "Product variant not found");
    }
    
    const doesSellerVariantExist = await findSellerVariantByProductVariantIdAndSellerId(ProductVariantId, sellerId);

    if(doesSellerVariantExist) {
        throw new AppError(400, "Seller variant for that product variant already exist");
    }

    const sellerVariant = await addSellerVariant(ProductVariantId, sellerId, price, stock);

    return res
    .status(201)
    .json({
        success: true,
        message: "Seller variant created successfully",
        data: sellerVariant
    });
};

const getAllSellerVariant = async (req, res) => {
    const { id: sellerId } = req.user?.seller;

    const sellerVariants = await findSellerVariantsBySellerId(sellerId)

    return res
    .status(200)
    .json({
        success: true,
        message: "Seller variants fetched successfully",
        data: sellerVariants
    });
};

const getSellerVariantByID = async (req, res) => {
    const { sellerVariantId } = req.params;
    const { id: sellerId } = req.user?.seller;

    const sellerVariant = await findSellerVariantBySellerVariantId(sellerVariantId, sellerId);

    if(!sellerVariant) {
        throw new AppError(404, "Seller variant not found");
    }

    return res
    .status(200)
    .json({
        success: true,
        message: "Seller variant fetched successfully",
        data: sellerVariant
    });
};

const updateSellerVariantById = async (req, res) => {
    const { sellerVariantId } = req.params;
    const { id: sellerId } = req.user?.seller;
    const updateData = req.body;

    const sellerVariant = await findSellerVariantBySellerVariantId(sellerVariantId, sellerId);

    if(!sellerVariant) {
        throw new AppError(404, "Seller variant not found");
    }

    const updatedSellerVariant = await updateSellerVariant(sellerId, sellerVariantId, updateData);

    return res
    .status(200)
    .json({
        success: true,
        message: "Seller variant updated successfully",
        data: updatedSellerVariant
    });
};

const deleteSellerVariantById = async (req, res) => {
    const { sellerVariantId } = req.params;
    const { id: sellerId } = req.user?.seller;

    const sellerVariant = await findSellerVariantBySellerVariantId(sellerVariantId, sellerId);

    if(!sellerVariant) {
        throw new AppError(404, "Seller variant not found");
    }

    const deletedSellerVariant = await deleteSellerVariant(sellerVariantId, sellerId);

    return res
    .status(200)
    .json({
        success: true,
        message: "Seller variant deleted successfully",
        data: deletedSellerVariant
    });
};

export {
    createSellerVariant,
    getAllSellerVariant,
    getSellerVariantByID,
    updateSellerVariantById,
    deleteSellerVariantById,
};