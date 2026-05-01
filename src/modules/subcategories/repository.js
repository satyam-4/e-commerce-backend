import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js";

export const findAllSubcategories = async () => {
    try {
        const res = await prisma.subcategory.findMany();
        return res;
    } catch (error) {
        throw new AppError(500, "Error while fetching subcategories");
    }
};

export const findSubcategoryById = async (subcategoryId) => {
    try {
        const res = await prisma.subcategory.findUnique({
            where: { id: subcategoryId }
        });
        return res;
    } catch (error) {
        throw new AppError(500, "Error while fetching subcategory");
    }
};

export const findProductsBySubcategoryId = async (subcategoryId) => {
    try {
        const products = await prisma.product.findMany({
            where: { subcategoryId: subcategoryId }
        });
        return products;
    } catch (error) {
        throw new AppError(500, "Error while fetching products");
    }
};

export const updateSubcategoryById = async (subcategoryId, subcategoryData) => {
    try {
        const updatedSubcategory = await prisma.subcategory.update({
            where: { id: subcategoryId },
            data: subcategoryData
        });

        return updatedSubcategory;
    } catch (error) {
        throw new AppError(500, "Error while updating the subcategory");
    }
};

export const destroySubcategoryById = async (subcategoryId) => {
    try {
        const deletedSubCategory = await prisma.subcategory.delete({
            where: { id: subcategoryId }
        });

        return deletedSubCategory;
    } catch (error) {
        throw new AppError(500, "Error while deleting the subcategory");
    }
};