import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js"

export const findAllCategories = async () => {
    const res = await prisma.category.findMany();
    return res;
};

export const findCategoryById = async (categoryId) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    });
    return category;
};

export const findsubcategoriesByCategoryId = async (categoryId) => {
    const res = await prisma.subcategory.findMany({
        where: { categoryId: categoryId }
    });
    return res;
};

export const addSubcategory = async (subcategoryData) => {
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
};

export const addNewCategory = async(categoryData) => {
    const category = await prisma.category.create({
        data: categoryData
    });

    return category;
};

export const updateCategoryById = async(categoryId, categoryData) => {
    const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: categoryData
    });

    return updatedCategory;
};

export const destroyCategoryById = async(categoryId) => {
    const deletedCategory = await prisma.category.delete({
        where: { id: categoryId }
    });
    return deletedCategory;
};