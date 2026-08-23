const prisma = require('../../prisma/prismaClient');
const AppError = require('../../utils/errors/AppError');

exports.createCategory = async (categoryData) => {
    const { name } = categoryData;

    if (!name) {
        throw new AppError('Category name is required', 400);
    }

    const existingCategory = await prisma.category.findUnique({
        where: { name }
    });

    if (existingCategory) {
        throw new AppError('Category already exists', 409);
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
        throw new AppError('Category not found', 404);
    }

    if (name) {
        const existingCategory = await prisma.category.findUnique({
            where: { name }
        });

        if (existingCategory && existingCategory.id !== Number(categoryId)) {
            throw new AppError('Category name already exists', 409);
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
        throw new AppError('Category not found', 404);
    }

    // Check if category has products
    const productsCount = await prisma.product.count({
        where: { categoryId: Number(categoryId) }
    });

    if (productsCount > 0) {
        throw new AppError('Cannot delete category with associated products', 409);
    }

    await prisma.category.delete({
        where: { id: Number(categoryId) }
    });
};

