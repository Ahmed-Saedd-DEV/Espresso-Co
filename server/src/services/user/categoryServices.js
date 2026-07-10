const prisma = require('../../prisma/prismaClient');

exports.getCategories = async () => {
    const categories = await prisma.category.findMany({
        include: {
            products: true
        }
    });
    return categories;
};

exports.getCategoryById = async (categoryId) => {
    const category = await prisma.category.findUnique({
        where: { id: Number(categoryId) },
        include: {
            products: true
        }
    });

    if (!category) {
        throw new Error('Category not found');
    }

    return category;
};



module.exports = exports;
