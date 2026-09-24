const prisma = require("../../prisma/prismaClient");
const pagination = require("../../utils/queryFeatures/pagination");
const sort = require("../../utils/queryFeatures/sort");
const search = require("../../utils/queryFeatures/search");
const filter = require("../../utils/queryFeatures/filter");
const AppError = require("../../utils/errors/AppError");

const getAllReviews = async ({
  page,
  limit,
  searchQuery,
  rating,
  productId,
  sort: sortField,
  order,
}) => {
  const searchWhiteList = ["comment"];
  const searchWhere = search.getSearch(searchQuery, searchWhiteList);

  const where = filter.getFiltered(
    {
      rating: rating !== undefined ? Number(rating) : undefined,
      productId: productId !== undefined ? Number(productId) : undefined,
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
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true } },
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

const deleteReview = async (id) => {
  const reviewId = Number(id);
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    throw new AppError("Invalid review ID", 400);
  }

  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing) {
    throw new AppError("Review not found", 404);
  }

  await prisma.review.delete({ where: { id: reviewId } });
  return true;
};

const deleteManyReviews = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError("No IDs provided", 400);
  }

  const numericIds = ids.map((v) => Number(v));
  const result = await prisma.review.deleteMany({
    where: { id: { in: numericIds } },
  });

  return { deletedCount: result.count };
};

module.exports = {
  getAllReviews,
  deleteReview,
  deleteManyReviews,
};
