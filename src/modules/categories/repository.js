import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js"

export const findAllCategories = async () => {
    try {
        const res = await prisma.category.findMany();
        return res;
    } catch (error) {
        console.error("Prisma error:", error);
        throw new AppError(500, "Error while fetching categories");
    }
};

export const findCategoryById = async (categoryId) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        });
        return category;
    } catch (error) {
        console.error("Prisma error:", error);
        throw new AppError(500, "Error while fetching category");
    }
};

export const findsubcategoriesByCategoryId = async (categoryId) => {
    try {
        const res = await prisma.subcategory.findMany({
            where: { categoryId: categoryId }
        });
        return res;
    } catch (error) {
        console.error("Prisma error:", error);
        throw new AppError(500, "Error while fetching subcategories");
    }
};

export const addSubcategory = async (subcategoryData) => {
    try {
        const existingSubcategory = await prisma.subcategory.findUnique({
            where: {
                name: subcategoryData.name,
                slug: subcategoryData.slug
            }
        });

        if(existingSubcategory) {
            throw new AppError(404, "Subcategory already exists");
        }
        
        const subcategory = await prisma.subcategory.create({
            data: subcategoryData
        });

        return subcategory;
    } catch (error) {
        if(error instanceof AppError) {
            throw error;
        }
        console.error("Prisma error:", error);
        throw new AppError(500, "Error while creating new subcategory");
    }
};

export const addNewCategory = async(categoryData) => {
    try {
        const existingCategory = await prisma.category.findUnique({
            where: { 
                name: categoryData.name,
                slug: categoryData.slug
            }
        });

        if(existingCategory) {
            throw new AppError(400, "Category already exists");
        }

        const category = await prisma.category.create({
            data: categoryData
        });

        return category;
    } catch (error) {
        if(error instanceof AppError) {
            throw error;
        }
        console.error("Prisma error:", error);
        throw new AppError(500, "Error while creating new category");
    }
};

export const updateCategoryById = async(categoryId, categoryData) => {
    try {
        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: categoryData
        });

        return updatedCategory;
    } catch (error) {
        if(error instanceof AppError) {
            throw error;
        }
        console.error("Prisma error:", error);
        throw new AppError(500, "Error while updating category");
    }
};

export const destroyCategoryById = async(categoryId) => {
    try {
        const deletedCategory = await prisma.category.delete({
            where: { id: categoryId }
        });
        return deletedCategory;
    } catch (error) {
        console.error("Prisma error:", error);
        throw new AppError(500, "Error while deleting the category");
    }
};