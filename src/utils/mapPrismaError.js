import { Prisma } from "@prisma/client";
import { AppError } from "./AppError.js";

const mapPrismaError = (error) => {
    if (error instanceof AppError) {
        return error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2002": {
                const fields = error.meta?.target?.join(", ") || "field";
                return new AppError(409, `A record with this ${fields} already exists`);
            }
            case "P2025":
                return new AppError(404, "Record not found");
            case "P2003":
                return new AppError(400, "Invalid reference to a related record");
            default:
                return new AppError(500, "Database error");
        }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return new AppError(400, "Invalid data provided");
    }

    return new AppError(500, "Internal server error");
};

export { mapPrismaError };