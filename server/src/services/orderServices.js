const prisma = require('../prisma/prismaClient');

const createOrder = async (orderData, userId) => {
    let items = orderData.orderItems || orderData.items;

    if (!items && orderData.productId) {
        items = [orderData];
    }

    if (!items || items.length === 0) {
        throw new Error('No order items provided');
    }

    if (!userId) {
        throw new Error('Authentication required');
    }

    const normalizedItems = items.map((item) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity || 1)
    }));

    if (normalizedItems.some((item) => Number.isNaN(item.price) || item.price < 0)) {
        throw new Error('Each order item must have a valid price');
    }

    const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!Number.isFinite(total) || total <= 0) {
        throw new Error('Invalid total amount');
    }

    return await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                user: {
                    connect: { id: userId }
                },
                total,
                status: orderData.status || 'PENDING'
            },
            include: {
                orderItems: true
            }
        });

        await tx.orderItem.createMany({
            data: normalizedItems.map((item) => ({
                orderId: newOrder.id,
                productId: item.productId,
                quantity: item.quantity || 1,
                price: item.price
            }))
        });

        return await tx.order.findUnique({
            where: { id: newOrder.id },
            include: {
                orderItems: true
            }
        });
    });
};

module.exports = { createOrder };