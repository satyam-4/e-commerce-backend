import express from "express";
import { handleCancelOrder, handleCheckout, handleGetMyOrders, handleGetOrderById, handleGetSellerOrders, handleUpdateSubOrderStatus } from "./controller.js";
import { requireAuth } from "#middlewares/auth.middleware.js";
import { checkRole } from "#middlewares/role.middleware.js";

const router = express.Router();

router.route("/checkout").post(
    requireAuth, 
    checkRole(["BUYER"]), 
    handleCheckout
);

router.route("/my").get(
    requireAuth,
    checkRole(["BUYER"]),
    handleGetMyOrders
);

router.route("/seller").get(
    requireAuth,
    checkRole(["SELLER"]),
    handleGetSellerOrders
);

router.route("/:orderId").get(
    requireAuth,
    checkRole(["BUYER"]),
    handleGetOrderById
);

router.route("/:orderId/cancel").post(
    requireAuth,
    checkRole(["BUYER"]),
    handleCancelOrder
);

router.route("/suborder/:subOrderId/status").patch(
    requireAuth,
    checkRole(["SELLER"]),
    handleUpdateSubOrderStatus
);


export default router;