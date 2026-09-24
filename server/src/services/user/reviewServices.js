const prisma = require("../../prisma/prismaClient");
const pagination = require("../../utils/queryFeatures/pagination");
const sort = require("../../utils/queryFeatures/sort");
const filter = require("../../utils/queryFeatures/filter");
const search = require("../../utils/queryFeatures/search");
const AppError = require("../../utils/errors/AppError");

exports.createReview = async (reviewData, userId) => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const { productId, rating, comment } = reviewData || {};

  if (!productId) {
    throw new AppError("productId is required", 400);
  }

  const normalizedRating = Number(rating);
  if (
    !Number.isInteger(normalizedRating) ||
    normalizedRating < 1 ||
    normalizedRating > 5
  ) {
    throw new AppError("rating must be an integer between 1 and 5", 400);
  }

  return await prisma.review.create({
    data: {
      user: {
        connect: { id: userId },
      },
      product: {
        connect: { id: Number(productId) },
      },
      rating: normalizedRating,
      comment: comment?.trim() || null,
    },
  });
};

exports.getReviews = async ({
  page,
  limit,
  sort: sortField,
  order,
  rating,
  search: searchQuery,
  productId,
}) => {
  if (!productId) {
    throw new AppError("productId is required", 400);
  }

  const searchWhiteList = ["comment"];
  const searchWhere = search.getSearch(searchQuery, searchWhiteList);

  const where = filter.getFiltered(
    {
      productId: Number(productId),
      rating: rating !== undefined ? Number(rating) : undefined,
      ...searchWhere,
    },
    {},
  );
  const totalRecords = await prisma.review.count({ where });
  const paginationData = pagination.getPagination(page, limit, totalRecords);
  const whiteList = ["id", "rating", "createdAt", "updatedAt"];
  const normalizedSort = sort.resolveSortQuery({ sort: sortField, order });
  const sorting = sort.getSorting(
    normalizedSort.sort,
    normalizedSort.order,
    whiteList,
  );
  const reviews = await prisma.review.findMany({
    where,
    include: {
      user: { select: { id: true, name: true } },
    },
    skip: paginationData.skip,
    take: paginationData.take,
    orderBy: sorting,
  });

  return {
    reviews,
    totalPages: paginationData.totalPages,
    totalRecords,
    page: paginationData.page,
    limit: paginationData.limit,
  };
};

exports.updateReview = async (id, userId, data) => {
  const review = await prisma.review.findUnique({ where: { id: Number(id) } });
  if (!review) {
    throw new AppError("Review not found", 404);
  }
  if (review.userId !== Number(userId)) {
    throw new AppError("You can only edit your own reviews", 403);
  }

  const payload = {};
  if (data.rating !== undefined) payload.rating = Number(data.rating);
  if (data.comment !== undefined)
    payload.comment = data.comment?.trim() || null;

  if (Object.keys(payload).length === 0) {
    throw new AppError("No update fields provided", 400);
  }

  return await prisma.review.update({
    where: { id: Number(id) },
    data: payload,
  });
};

exports.deleteReview = async (id, userId) => {
  const review = await prisma.review.findUnique({ where: { id: Number(id) } });
  if (!review) {
    throw new AppError("Review not found", 404);
  }
  if (review.userId !== Number(userId)) {
    throw new AppError("You can only delete your own reviews", 403);
  }

  return await prisma.review.delete({ where: { id: Number(id) } });
};
