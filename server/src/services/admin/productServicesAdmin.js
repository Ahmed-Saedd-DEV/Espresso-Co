const prisma = require('../../prisma/prismaClient');

exports.createProduct = async (productData, userId) => {
    const { userId: _, ...safeProductData } = productData || {};

    const newProduct = await prisma.product.create({
        data: {
            ...safeProductData,
            userId: Number(userId)
        }
    });
    return newProduct;
};

exports.updateProduct = async (productId, productData, userId) => {
    const { userId: _, ...safeProductData } = productData || {};

    const updatedProduct = await prisma.product.update({
        where: { id: Number(productId) },
        data: {
            ...safeProductData,
            ...(userId ? { userId: Number(userId) } : {})
        }
    });
    return updatedProduct;
};

exports.deleteProduct = async (productId, userId) => {
    const existingProduct = await prisma.product.findUnique({
        where: { id: Number(productId) }
    });

    if (!existingProduct) {
        throw new Error('Product not found');
    }

    if (userId && existingProduct.userId !== Number(userId)) {
        throw new Error('Unauthorized');
    }

    await prisma.product.delete({
        where: { id: Number(productId) }
    });
};