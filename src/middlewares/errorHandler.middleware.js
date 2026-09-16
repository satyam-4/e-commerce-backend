import { logger } from "../config/logger";

export const errorHandler = (err, req, res, next) => {
    const statusCode = err?.statusCode || 500;

    logger.error(
        { err, statusCode, method: req.method, path: req.originalUrl },
        "Request error"
    );

    if (process.env.NODE_ENV === "development") {
        return res
        .status(statusCode)
        .json({
            success: false,
            message: err.message,
            stack: err.stack
        })
    } else {
        return res
        .status(statusCode)
        .json({
            success: false,
            message: err.message
        });
    }
};