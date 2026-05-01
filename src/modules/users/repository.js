import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js"

export const createNewSeller = async (userId, pickupAddress, businessName, gstNumber, bankAccountNumber, ifscCode, bankName) => {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: "SELLER" }
        }); 

        const seller = await prisma.seller.create({
            data: {
                userId: userId,
                pickupAddress: pickupAddress,
                businessName: businessName,
                gstNumber: gstNumber,
                bankAccountNumber: bankAccountNumber,
                ifscCode: ifscCode,
                bankName: bankName
            }
        });

        return seller;
    } catch (error) {
        console.error("Prisma error:", error);
        throw new AppError(500, "Error while creating new seller")
    }
}