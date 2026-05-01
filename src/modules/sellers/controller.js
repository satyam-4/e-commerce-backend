import { AppError } from "#utils/AppError.js";
import { sellerVariantRepository } from "./repository.js";

const createSellerVariant = async (req, res) => {
    const { ProductVariantId, price, stock } = req.body;

    let { id: userId } = req.user;

    const seller = await sellerVariantRepository.findSellerByUserId(userId);

    if(!seller) {
        throw new AppError(404, "Seller not found")
    }

    const productVariant = await sellerVariantRepository.getProductVariantByProductVariantId(ProductVariantId);

    if(!productVariant) {
        throw new AppError(404, "Product variant not found");
    }
    
    const doesSellerVariantExist = await sellerVariantRepository.findSellerVariantByProductVariantIdAndSellerId(ProductVariantId, seller.id);

    if(doesSellerVariantExist) {
        throw new AppError(400, "Seller variant for that product variant already exist");
    }

    const sellerVariant = await sellerVariantRepository.addSellerVariant(ProductVariantId, seller.id, price, stock);

    return res
    .status(201)
    .json({
        success: true,
        message: "Seller variant created successfully",
        data: sellerVariant
    });
};

const getAllSellerVariant = async (req, res) => {
    const { id: userId } = req.user;

    const seller = await sellerVariantRepository.findSellerByUserId(userId);

    if(!seller) {
        throw new AppError(404, "Seller not found")
    }

    const sellerVariants = await sellerVariantRepository.findSellerVariantsBySellerId(seller.id)

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
    const { id: userId } = req.user;

    const seller = await sellerVariantRepository.findSellerByUserId(userId);

    if(!seller) {
        throw new AppError(404, "Seller not found")
    }

    const sellerVariant = await sellerVariantRepository.findSellerVariantBySellerVariantId(sellerVariantId);

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
    const { id: userId } = req.user;
    const updateData = req.body;

    const seller = await sellerVariantRepository.findSellerByUserId(userId);

    if(!seller) {
        throw new AppError(404, "Seller not found")
    }

    const sellerVariant = await sellerVariantRepository.findSellerVariantBySellerVariantId(sellerVariantId);

    if(!sellerVariant) {
        throw new AppError(404, "Seller variant not found");
    }

    const updatedSellerVariant = await sellerVariantRepository.updateSellerVariant(sellerVariantId, updateData);

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
    const { id: userId } = req.user;

    const seller = await sellerVariantRepository.findSellerByUserId(userId);

    if(!seller) {
        throw new AppError(404, "Seller not found")
    }

    const sellerVariant = await sellerVariantRepository.findSellerVariantBySellerVariantId(sellerVariantId);

    if(!sellerVariant) {
        throw new AppError(404, "Seller variant not found");
    }

    const deletedSellerVariant = await sellerVariantRepository.deletedSellerVariant(sellerVariantId);

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