const prisma = require("../../prisma/prismaClient");
const pagination = require("../../utils/queryFeatures/pagination");
const sort = require("../../utils/queryFeatures/sort");
const filter = require("../../utils/queryFeatures/filter");
const search = require("../../utils/queryFeatures/search");

exports.createReview = async (reviewData, userId) => {
  if (!userId) {
    throw new Error("Authentication required");
  }

  const { productId, rating, comment } = reviewData || {};

  if (!productId) {
    throw new Error("productId is required");
  }

  const normalizedRating = Number(rating);
  if (
    !Number.isInteger(normalizedRating) ||
    normalizedRating < 1 ||
    normalizedRating > 5
  ) {
    throw new Error("rating must be an integer between 1 and 5");
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
  { page, limit, sortBy, order, rating, search: searchQuery },
  { userId },
) => {
  if (!userId) {
    throw new Error("Authentication required");
  }

  const searchWhiteList = ["comment"];

  const searchWhere = search.getSearch(
    searchQuery,
    searchWhiteList,
  );

  const where = filter.getFiltered(
    { rating: rating !== undefined ? Number(rating) : undefined, ...searchWhere },
    { userId },
  );
  const totalRecords = await prisma.review.count({
    where,
  });

  const { skip, take, totalPages } = pagination.getPagination(
    page,
    limit,
    totalRecords,
  );
  const whiteList = ["id", "rating", "createdAt", "updatedAt"];
  const sorting = sort.getSorting(sortBy, order, whiteList);
  const reviews = await prisma.review.findMany({
    where,
    include: { product: true },
    skip,
    take,
    orderBy: sorting,
  });

  return { reviews, totalPages, totalRecords };
};
