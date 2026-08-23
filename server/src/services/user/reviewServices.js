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

exports.getReviews = async (
  { page, limit, sort: sortField, order, rating, search: searchQuery },
  { userId },
) => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const searchWhiteList = ["comment"];
  const searchWhere = search.getSearch(searchQuery, searchWhiteList);

  const where = filter.getFiltered(
    {
      rating: rating !== undefined ? Number(rating) : undefined,
      ...searchWhere,
    },
    { userId },
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
    include: { product: true },
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
