import { AppError } from "#utils/AppError.js";
import { 
    destroySubcategoryById, 
    findAllSubcategories, 
    findProductsBySubcategoryId, 
    findSubcategoryById, 
    updateSubcategoryById,
} from "./repository.js"

const getAllSubcategories = async (req, res) => {
    const subcategories = await findAllSubcategories();

    return res
    .status(200)
    .json({
        success: true,
        message: "Fetched all subcategories successfully",
        data: subcategories
    });
};

const getSubcategoryById = async (req, res) => {
    const { subcategoryId } = req.params;

    const subcategory = await findSubcategoryById(subcategoryId);

    if(!subcategory) {
        throw new AppError(404, "Subcategory not found");
    }

    return res
    .status(200)
    .json({
        success: true,
        message: "Fetched subcategory successfully",
        data: subcategory
    });
};

const getProductsBySubcategoryId = async (req, res) => {
    const { subcategoryId } = req.params;

    const subcategory = await findSubcategoryById(subcategoryId);

    if(!subcategory) {
        throw new AppError(404, "Subcategory not found");
    }

    const products = await findProductsBySubcategoryId(subcategoryId);

    if(!products) {
        throw new AppError(404, "Products not found");
    }

    return res
    .status(200)
    .json({
        success: true,
        message: "Fetched products successfully",
        data: products
    });
};

const updateSubcategory = async (req, res) => {
    const subcategoryData = req.body;
    const { subcategoryId } = req.params;

    const subcategory = await findSubcategoryById(subcategoryId);

    if(!subcategory) {
        throw new AppError(404, "Subcategory not found");
    }

    const updatedSubcategory = await updateSubcategoryById(subcategoryId, subcategoryData);

    return res
    .status(200)
    .json({
        success: true,
        message: "Successfully updated subcategory",
        data: updatedSubcategory
    });

};

const deleteSubcategory = async (req, res) => {
    const { subcategoryId } = req.params;

    const subcategory = await findSubcategoryById(subcategoryId);

    if(!subcategory) {
        throw new AppError(404, "Subcategory not found");
    }

    const deletedSubCategory = await destroySubcategoryById(subcategoryId);

    return res
    .status(200)
    .json({
        success: true,
        message: "Successfully deleted subcategory",
        data: deletedSubCategory
    });
};

export {
    getAllSubcategories,
    getSubcategoryById,
    getProductsBySubcategoryId,
    updateSubcategory,
    deleteSubcategory,
};