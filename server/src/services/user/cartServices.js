const prisma = require('../../prisma/prismaClient');

const getCart = async (userId) => {
    return await prisma.cart.findUnique({
        where: { userId: Number(userId) },
        include: { items: true }
    });
};

const addToCart = async (userId, productId, quantity) => {
    const cart = await prisma.cart.upsert({
        where: { userId: Number(userId) },
        update: {},
        create: { userId: Number(userId) }
    });

    const parsedProductId = Number(productId);
    const parsedQuantity = Number(quantity) || 1;

    return await prisma.cartProduct.upsert({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId: parsedProductId
            }
        },
        update: {
            quantity: {
                increment: parsedQuantity
            }
        },
        create: {
            cartId: cart.id,
            productId: parsedProductId,
            quantity: parsedQuantity
        }
    });
};

const updateCartItem = async (userId, productId, quantity) => {
    const cart = await prisma.cart.findUnique({
        where: { userId: Number(userId) }
    });

    if (!cart) {
        throw new Error('Cart not found');
    }

    return await prisma.cartProduct.update({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId: Number(productId)
            }
        },
        data: { quantity: Number(quantity) }
    });
};

const removeFromCart = async (userId, productId) => {
    const cart = await prisma.cart.findUnique({
        where: { userId: Number(userId) }
    });

    if (!cart) {
        throw new Error('Cart not found');
    }

    return await prisma.cartProduct.delete({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId: Number(productId)
            }
        }
    });
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
};