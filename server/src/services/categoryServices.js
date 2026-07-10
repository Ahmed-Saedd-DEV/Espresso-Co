const prisma = require('../prisma/prismaClient');

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

exports.createCategory = async (categoryData) => {
    const { name } = categoryData;

    if (!name) {
        throw new Error('Category name is required');
    }

    const existingCategory = await prisma.category.findUnique({
        where: { name }
    });

    if (existingCategory) {
        throw new Error('Category already exists');
    }

    const newCategory = await prisma.category.create({
        data: {
            name
        }
    });

    return newCategory;
};

exports.updateCategory = async (categoryId, categoryData) => {
    const { name } = categoryData;

    const category = await prisma.category.findUnique({
        where: { id: Number(categoryId) }
    });

    if (!category) {
        throw new Error('Category not found');
    }

    if (name) {
        const existingCategory = await prisma.category.findUnique({
            where: { name }
        });

        if (existingCategory && existingCategory.id !== Number(categoryId)) {
            throw new Error('Category name already exists');
        }
    }

    const updatedCategory = await prisma.category.update({
        where: { id: Number(categoryId) },
        data: {
            ...(name && { name })
        }
    });

    return updatedCategory;
};

exports.deleteCategory = async (categoryId) => {
    const category = await prisma.category.findUnique({
        where: { id: Number(categoryId) }
    });

    if (!category) {
        throw new Error('Category not found');
    }

    // Check if category has products
    const productsCount = await prisma.product.count({
        where: { categoryId: Number(categoryId) }
    });

    if (productsCount > 0) {
        throw new Error('Cannot delete category with associated products');
    }

    await prisma.category.delete({
        where: { id: Number(categoryId) }
    });
};

module.exports = exports;
