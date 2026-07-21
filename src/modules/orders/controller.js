import { AppError } from "#utils/AppError.js";
import { 
    cancelOrder,
    checkout, 
    getMyOrders, 
    getOrderDetails, 
    getSellerOrders, 
    updateSubOrderStatus 
} from "./service.js";
import { sellerVariantRepository } from "../sellers/repository.js";

const handleCheckout = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const order = await checkout(userId);

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong during checkout"
        });
    }
};

const handleGetMyOrders = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const orders = await getMyOrders(userId);

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders 
        })

    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching orders"
        });
    }
};

const handleGetOrderById = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const orderId = parseInt(req.params.orderId);

        if (isNaN(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order id"
            });
        }

        const order = await getOrderDetails(orderId, userId);

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching order"
        });
    };
};

const handleGetSellerOrders = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { status } = req.query;

        const seller = await sellerVariantRepository.findSellerByUserId(userId);

        if (!seller) {
            throw new AppError(404, "Seller profile not found");
        }

        const subOrders = await getSellerOrders(seller.id, status);

        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: subOrders
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching orders"
        });
    }
};

const handleUpdateSubOrderStatus = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const subOrderId = parseInt(req.params.subOrderId);
        
        if (isNaN(subOrderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subOrder id"
            });
        }

        const seller = await sellerVariantRepository.findSellerByUserId(userId);
        
        if (!seller) {
            throw new AppError(404, "Seller profile not found");
        }

        const result = await updateSubOrderStatus(userId, subOrderId);

        res.status(200).json({
            success: true,
            message: `SubOrder status updated to ${result.updatedStatus}`,
            data: result
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong while updating suborder status"
        });
    }
};

const handleCancelOrder = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { orderId } = req.params;

        const result = await cancelOrder(orderId, userId);

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: result
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong while cancelling order"
        });
    }
};

export {
    handleCheckout,
    handleGetMyOrders,
    handleGetOrderById,
    handleGetSellerOrders,
    handleUpdateSubOrderStatus,
    handleCancelOrder
};