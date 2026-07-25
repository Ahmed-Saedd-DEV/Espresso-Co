const prisma = require('../../prisma/prismaClient');

const createOrder = async (orderData, userId) => {
    if (!userId) {
        throw new Error("Authentication required");
    }

    const items = orderData.items;

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("No order items provided");
    }

    const normalizedItems = items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity ?? 1),
    }));

    const invalidItem = normalizedItems.some(
        (item) =>
            !Number.isInteger(item.productId) ||
            item.productId <= 0 ||
            !Number.isInteger(item.quantity) ||
            item.quantity <= 0
    );

    if (invalidItem) {
        throw new Error("Invalid order items");
    }

    const productIds = [
        ...new Set(
            normalizedItems.map(
                (item) => item.productId
            )
        ),
    ];

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
        },
    });

    if (products.length !== productIds.length) {
        throw new Error(
            "One or more products not found"
        );
    }

    const orderItems = normalizedItems.map((item) => {
        const product = products.find(
            (product) => product.id === item.productId
        );

        return {
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
        };
    });

    const total = orderItems.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    if (!Number.isFinite(total) || total <= 0) {
        throw new Error("Invalid total amount");
    }

    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                userId,
                total,
                status: "PENDING",
            },
        });

        await tx.orderItem.createMany({
            data: orderItems.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
        });

        return tx.order.findUnique({
            where: {
                id: order.id,
            },
            include: {
                orderItems: true,
            },
        });
    });
};

module.exports = { createOrder };