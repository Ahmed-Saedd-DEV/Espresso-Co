const prisma = require('../prisma/prismaClient');

exports.createReview = async (reviewData, userId) => {
    if (!userId) {
        throw new Error('Authentication required');
    }

    const { productId, rating, comment } = reviewData || {};

    if (!productId) {
        throw new Error('productId is required');
    }

    const normalizedRating = Number(rating);
    if (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
        throw new Error('rating must be an integer between 1 and 5');
    }

    return await prisma.review.create({
        data: {
            user: {
                connect: { id: userId }
            },
            product: {
                connect: { id: Number(productId) }
            },
            rating: normalizedRating,
            comment: comment?.trim() || null
        }
    });
};

exports.createOrderFromCart = async (userId) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Get cart with products
        const cart = await tx.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // 2. Calculate total correctly + prepare order items
        let total = 0;
        const orderItemsData = cart.items.map(item => {
            const price = Number(item.product.price);
            const quantity = Number(item.quantity || 1);
            const subtotal = price * quantity;

            total += subtotal;

            return {
                productId: item.productId,
                quantity,
                price,                    // Snapshot the price at time of order
            };
        });

        if (isNaN(total) || total <= 0) {
            throw new Error('Invalid total amount');
        }

        // 3. Create order
        const newOrder = await tx.order.create({
            data: {
                user: {
                    connect: { id: userId }
                },
                total,
                status: 'PENDING'
            },
            include: {
                orderItems: true
            }
        });

        // 4. Create order items
        await tx.orderItem.createMany({
            data: orderItemsData.map(item => ({
                ...item,
                orderId: newOrder.id
            }))
        });

        // 5. Clear the cart (optional but recommended)
        await tx.cartProduct.deleteMany({
            where: { cartId: cart.id }
        });

        // Return fresh order with items
        return await tx.order.findUnique({
            where: { id: newOrder.id },
            include: {
                orderItems: {
                    include: { product: true }
                }
            }
        });
    });
};

module.exports = {
    createReview: exports.createReview,
    createOrderFromCart: exports.createOrderFromCart
};