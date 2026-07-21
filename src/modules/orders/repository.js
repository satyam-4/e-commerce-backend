import { AppError } from "#utils/AppError.js";
import prisma from "../../prisma/client.js";

/*
    the response is going to look like this - 
    [
        {
            quantity: X,
            sellerVariant: {
                id: X,
                sellerId: X,
                price: X,
                stock: X,
            }
        }
    ]
*/

const getCartItemsForCheckout = async (userId) => {
    return await prisma.cart.findMany({
        where: { userId },
        select: {
            quantity: true,
            sellerVariant: {
                select: {
                    id: true,
                    sellerId: true,
                    price: true,
                    stock: true
                }
            }
        }
    });
};

const createOrderWithSuborders = async (userId, groupedItems, totalAmount) => {
    return await prisma.$transaction(async (tx) => {
        // create parent order
        const order = await tx.order.create({
            data: {
                userId,
                totalAmount,
                status: "PENDING"
            }
        });
    
        // loop through each seller group
        for (const sellerId in groupedItems) {
            const items = groupedItems[sellerId];
    
            // create subOrder for this seller
            const subOrder = await tx.subOrder.create({
                data: {
                    orderId: order.id,
                    sellerId,
                    status: "PENDING"
                }
            });
    
            // create orderItems and decreament the stock of each item
            for (const item of items) {
                const { id: sellerVariantId, price, stock } = item.sellerVariant;
                const { quantity } = item;
    
                // stock guard - it checks if stock >= quantity and decreaments the stock by quantity in one atomic operation to avoid race conditions
                const updated = await tx.sellerVariant.updateMany({
                    where: {
                        id: sellerVariantId,
                        stock: { gte: quantity }
                    },
                    data: {
                        stock: { decrement: quantity }
                    }
                });
    
                if (updated.count === 0) {
                    throw new AppError(409, 'Item went out of stock, please try again');
                }
    
                // create orderItem with price snapshot
                await tx.orderItem.create({
                    data: {
                        subOrderId: subOrder.id,
                        sellerVariantId,
                        quantity,
                        priceAtPurchase: price
                    }
                });
            }
        }
    
        // clear the users cart
        await tx.cart.deleteMany({
            where: { userId }
        });
    
        return order;

    });
};

const getOrdersByUser = async (userId) => {
    return await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            subOrders: {
                select: {
                    seller: {
                        select: { businessName: true }
                    },
                    status: true,
                    items: {
                        select: {
                            sellerVariant: {
                                select: {
                                    productVariant: {
                                        select: {
                                            attributes: true,
                                            product: {
                                                select: {
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            priceAtPurchase: true
                        }
                    }
                }
           }
        }
    })
};

const getOrdersById = async (orderId, userId) => {
    return await prisma.order.findFirst({
        where: {
            id: orderId,
            userId
        },
        select: {
            totalAmount: true,
            status: true,
            createdAt: true,
            subOrders: {
                select: {
                    seller: {
                        select: { businessName: true }
                    },
                    status: true,
                    items: {
                        select: {
                            sellerVariant: {
                                select: {
                                    productVariant: {
                                        select: {
                                            attributes: true,
                                            product: {
                                                select: {
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            priceAtPurchase: true
                        }
                    }
                }
           }
        }
    });
};

const getSubOrdersBySeller = async (sellerId, status) => {
    return await prisma.subOrder.findMany({
        where: { 
            sellerId, 
            ...(status && { status })
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            order: {
                select: {
                    user: {
                        select: {
                            fullName: true,
                            address: true,
                        }
                    }
                }
            },
            items: {
                select: {
                    quantity: true,
                    priceAtPurchase: true,
                    sellerVariant: {
                        select: {
                            productVariant: {
                                select: {
                                    sku: true,
                                    attributes: true,
                                    product: {
                                        select: {
                                            name: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
};

const getSubOrderById = async (subOrderId, sellerId) => {
    return await prisma.subOrder.findFirst({
        where: {
            id: subOrderId,
            sellerId
        },
        select: {
            id: true,
            status: true,
            orderId: true
        }
    });
};

const updateSubOrderStatus = async (suborderId, status) => {
    return await prisma.subOrder.update({
        where: { id: suborderId },
        data: { status }
    });
};

const recalculateOrderStatus = async (orderId) => {
    const subOrders = await prisma.subOrder.findMany({
        where: { orderId },
        select: { status: true }
    });

    const statuses = subOrders.map(s => s.status);

    let newStatus;

    if (statuses.every(s => s === "PENDING")) {
        newStatus = "PENDING";
    } else if (statuses.every(s => s === "SHIPPED")) {
        newStatus = "SHIPPED";
    } else if (statuses.every(s => s === "CANCELLED")) {
        newStatus = "CANCELLED";
    } else if (statuses.every(s => s === "DELIVERED")) {
        newStatus = "DELIVERED";
    } else {
        newStatus = "PROCESSING";
    }

    await prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus }
    });
};

const getOrdersWithItemsById = async (orderId, userId) => {
    return await prisma.order.findFirst({
        where: { id: orderId, userId },
        select: {
            id: true,
            status: true,
            subOrders: {
                select: {
                    id: true,
                    status: true,
                    items: {
                        select: {
                            id: true,
                            sellerVariantId: true,
                            quantity: true
                        }
                    }
                }
            }
        }
    });
};

const cancelOrderTransaction = async (order) => {
    prisma.$transaction(async (tx) => {
        // restore stock for every order item
        for (const subOrders of order.subOrders) {
            for (const orderItems of subOrders.items) {
                await tx.sellerVariant.update({
                    where: { id: orderItems.sellerVariantId },
                    data: { stock: { increment: orderItems.quantity } }
                });
            }
        }

        // cancel all suborders
        await tx.subOrder.updateMany({
            where: { orderId: order.id },
            data: { status: "CANCELLED" }
        });

        // cancel parent order
        await tx.order.update({
            where: { id: order.id,  },
            data: { status: "CANCELLED" } 
        });
    });
};

// const cancelOrderById = async (orderId, userId) => {
//     return await prisma.$transaction(async (tx) => {
//         const order = await tx.order.findFirst({
//             where: { id: orderId, userId },
//             select: {
//                 status: true,
//                 subOrders: {
//                     select: {
//                         id: true,
//                         status: true,
//                         items: {
//                             select: {
//                                 id: true,
//                                 sellerVariantId: true,
//                                 quantity: true
//                             }
//                         }
//                     }
//                 }
//             }
//         });

//         const statuses = order.subOrders.map(s => s.status);

//         if (!statuses.every(s => s === "PENDING")) {
//             throw new AppError(400, "Can't cancel the order at this stage");
//         }

//         // cancel all the suborders of this order
//         await tx.subOrder.updateMany({
//             where: { orderId },
//             data: { status: "CANCELLED" }
//         })

//         // restore the quantity of sellerVariants for all cancelled suborders
//         for (const subOrders of order.subOrders) {
//             for (const orderItems of subOrders.items) {
//                 await tx.sellerVariant.update({
//                     where: { id: orderItems.sellerVariantId },
//                     data: { stock: { increment: orderItems.quantity } }
//                 });
//             }
//         }

//         // cancel the parent order
//         await tx.order.update({
//             where: { id: orderId, userId },
//             data: { status: "CANCELLED" }
//         });
//     });
// };

export {
    getCartItemsForCheckout,
    createOrderWithSuborders,
    getOrdersByUser,
    getOrdersById,
    getSubOrdersBySeller,
    getSubOrderById,
    updateSubOrderStatus,
    recalculateOrderStatus,
    getOrdersWithItemsById,
    cancelOrderTransaction
};