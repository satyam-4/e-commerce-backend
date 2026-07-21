import { AppError } from "#utils/AppError.js"
import { 
    cancelOrderById,
    cancelOrderTransaction,
    createOrderWithSuborders, 
    getCartItemsForCheckout, 
    getOrdersById, 
    getOrdersByUser, 
    getOrdersWithItemsById, 
    getSubOrdersBySeller, 
    recalculateOrderStatus,
    updateSubOrderStatus as updateSubOrderStatusRepo
} from "./repository.js";

/*
    this is cartItems that we get in the arguments - 
    [
        {
            quantity: 4,
            sellerVariant: {
                id: 1,
                sellerId: 12,
                price: 45.49,
                stock: 120,
            }
        },
        {
            quantity: 1,
            sellerVariant: {
                id: 2,
                sellerId: 12,
                price: 99.49,
                stock: 224,
            }
        },
        {
            quantity: 10,
            sellerVariant: {
                id: 3,
                sellerId: 13,
                price: 45.49,
                stock: 120,
            }
        },
    ]

    this is what the service is going to return for the above data
    {
        12: [
            {
                quantity: 4,
                sellerVariant: {
                    id: 1,
                    sellerId: 12,
                    price: 45.49,
                    stock: 120,
                }
            },
            {
                quantity: 1,
                sellerVariant: {
                    id: 2,
                    sellerId: 12,
                    price: 99.49,
                    stock: 224,
                }
            }
        ],
        13: [
            {
                quantity: 10,
                sellerVariant: {
                    id: 3,
                    sellerId: 13,
                    price: 45.49,
                    stock: 120,
                }
            }
        ]
    
    }
*/

const groupBySeller = (cartItems) => {
    const grouped = {};

    for (const item of cartItems) {
        const sellerId = item.sellerVariant.sellerId;

        if (!grouped[sellerId]) {
            grouped[sellerId] = [];
        }

        grouped[sellerId].push(item);
    }

    return grouped;
};

const validateStockAndCalculateTotal = (cartItems) => {
    let totalAmount = 0;

    for (const item of cartItems) {
        const { price, stock } = item.sellerVariant;

        if (item.quantity > stock) {
            throw new AppError(400, "Insufficient stock for item");
        }

        totalAmount += (price * item.quantity);
    }

    return totalAmount;
};

const checkout = async (userId) => {
    const cartItems = await getCartItemsForCheckout(userId);

    if (cartItems.length === 0) {
        throw new AppError(400, 'Your cart is empty');
    }

    const totalAmount = validateStockAndCalculateTotal(cartItems);
    const groupedItems = groupBySeller(cartItems);

    const order = await createOrderWithSuborders(userId, groupedItems, totalAmount);

    return order;
};

const getMyOrders = async (userId) => {
    const orders = await getOrdersByUser(userId);

    if (orders.length === 0) return [];

    return orders;
};

const getOrderDetails = async (orderId, userId) => {
    const order = await getOrdersById(orderId, userId);

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    return order;
};

const getSellerOrders = async (sellerId, status) => {
    const subOrders = await getSubOrdersBySeller(sellerId, status);

    if (subOrders.length === 0) {
        return [];
    }

    return subOrders;
};

const updateSubOrderStatus = async (subOrderId, sellerId) => {
    const subOrder = await getSubOrdersBySeller(subOrderId, sellerId);

    if (!subOrder) {
        throw new AppError(404, "SubOrder not found");
    }

    const validTransitions = {
        PENDING: "PROCESSING",
        PROCESSING: "SHIPPED",
        SHIPPED: "DELIVERED"
    };

    let nextStatus = validTransitions[subOrder.status];

    if (!nextStatus) {
        throw new AppError(400, `Order is already ${subOrder.status}, no further updates allowed`);
    }

    await updateSubOrderStatusRepo(subOrderId, validTransitions[subOrder.status]);

    // if (subOrder.status === "PENDING") {
    //     await updateSubOrderStatus(subOrderId, "PROCESSING");
    // } else if (subOrder.status === "PROCESSING") {
    //     await updateSubOrderStatus(subOrderId, "SHIPPED");
    // } else if (subOrder.status === "SHIPPED") {
    //     await updateSubOrderStatus(subOrderId, "DELIVERED");
    // }

    await recalculateOrderStatus(subOrder.orderId);

    return { subOrderId, updatedStatus: nextStatus };
};

const cancelOrder = async (orderId, userId) => {
    // fetch order with all suborders and order items
    const order = await getOrdersWithItemsById(orderId, userId);

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    if (order.status === "CANCELLED") {
        throw new AppError(400, "Order is already cancelled");
    }

    const canCancel = order.subOrders.every(s => s.status === "PENDING");

    if (!canCancel) {
        throw new AppError(400, "Order cannot be cancelled as one or more sellers have started processing it");
    }

    await cancelOrderTransaction(order);

    return { orderId: order.id, status: "CANCELLED" };
};

export {
    groupBySeller,
    validateStockAndCalculateTotal,
    checkout,
    getMyOrders,
    getOrderDetails,
    getSellerOrders,
    updateSubOrderStatus,
    cancelOrder
};