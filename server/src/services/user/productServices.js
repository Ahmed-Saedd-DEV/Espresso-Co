const prisma = require('../../prisma/prismaClient');

exports.getProducts = async () => {
    const products = await prisma.product.findMany();
    return products;
};

exports.getProductById = async (productId) => {
    const product = await prisma.product.findUnique({
        where: { id: Number(productId) }
    });
    return product;
};
