import prisma from "../../prisma/client.js"

export const createNewSeller = async (userId, pickupAddress, businessName, gstNumber, bankAccountNumber, ifscCode, bankName) => {
    return await prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: userId },
            data: { role: "SELLER" }
        });

        const seller = await tx.seller.create({
            data: {
                userId,
                pickupAddress,
                businessName,
                gstNumber,
                bankAccountNumber,
                ifscCode,
                bankName
            }
        });

        return seller;
    });
}