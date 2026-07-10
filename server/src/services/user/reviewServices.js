const prisma = require('../../prisma/prismaClient');

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


module.exports = {
    createReview: exports.createReview
};