import { AppError } from "#utils/AppError.js";
import { 
    addNewCategory,
    addSubcategory,
    destroyCategoryById,
    findAllCategories, 
    findCategoryById, 
    findsubcategoriesByCategoryId, 
    updateCategoryById
} from "./repository.js";
import slugify from "slugify";

const getAllCategories = async (req, res) => {
    const categories = await findAllCategories()
    return res
    .status(200)
    .json({
        success: true,
        message: "Fetched all categories successfully",
        data: categories
    });
};

const getCategoryById = async (req, res) => {
    const { categoryId } = req.params;
    const category = await findCategoryById(categoryId);

    if(!category) {
        throw new AppError(404, "Category not found");
    }

    return res
    .status(200)
    .json({
        success: true,
        message: "Fetched category successfully",
        data: category
    });
};

const getSubcategoriesByCategoryId = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const category = await findCategoryById(categoryId);

        if(!category) {
            throw new AppError(404, "Category not found");
        }

        const subcategories = await findsubcategoriesByCategoryId(categoryId);
        
        return res
        .status(200)
        .json({
            success: true,
            message: "Fetched subcategories of category successfully",
            data: subcategories
        });
    } catch (error) {
        console.error(error);
        next(new AppError(500, "Failed to fetch subcategories"));
    }
};

const createSubcategoryByCategoryId = async (req, res) => {
    const subcategoryData = req.body;
    const { categoryId } = req.params;
    const slug = slugify(subcategoryData.name, { lower: true });
    subcategoryData.slug = slug;

    const category = await findCategoryById(categoryId);

    if(!category) {
        throw new AppError(404, "Category not found");
    }

    subcategoryData.categoryId = categoryId;

    const subcategory = await addSubcategory(subcategoryData);

    return res
    .status(201)
    .json({
        success: true,
        message: "Subcategory created successfully",
        data: subcategory
    });
};

const createCategory = async (req, res) => {
    const categoryData = req.body;
    categoryData.slug = slugify(categoryData.name, { lower: true });

    const category = await addNewCategory(categoryData);

    return res
    .status(201)
    .json({
        success: true,
        message: "Category created successfully",
        data: category
    })
};

const updateCategory = async (req, res) => {
    const categoryData = req.body;
    const { categoryId } = req.params;

    if(Object.keys(categoryData).includes("name")) {
        categoryData.slug = slugify(categoryData.name, { lower: true });
    }

    const category = await findCategoryById(categoryId);

    if(!category) {
        throw new AppError(404, "Category not found");
    }

    const updatedCategory = await updateCategoryById(categoryId, categoryData);

    return res
    .status(200)
    .json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory
    });
};

const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    const category = await findCategoryById(categoryId);

    if(!category) {
        throw new AppError(404, "Category not found");
    }

    const deletedCategory = await destroyCategoryById(categoryId);

    return res
    .status(200)
    .json({
        success: true,
        message: "Category deleted successfully",
        data: deletedCategory
    });
};

export {
    getAllCategories,
    getCategoryById,
    getSubcategoriesByCategoryId,
    createSubcategoryByCategoryId,
    createCategory,
    updateCategory,
    deleteCategory,
};