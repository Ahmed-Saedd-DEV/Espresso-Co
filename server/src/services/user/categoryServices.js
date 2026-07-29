const prisma = require("../../prisma/prismaClient");
const pagination = require("../../utils/queryFeatures/pagination");
const sort = require("../../utils/queryFeatures/sort");
const filter = require("../../utils/queryFeatures/filter");

exports.getCategories = async (
  { page, limit, sortBy, order, stock, price, minPrice, maxPrice, categoryId, search: searchQuery },
  { userId },
) => {
  if (!userId) {
    throw new Error("Authentication required");
  }

  const searchWhiteList = ["name"];
  const searchWhere = search.getSearch(searchQuery, searchWhiteList);
  const where = filter.getFiltered(
    {
      stock: stock !== undefined ? Number(stock) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
      ...searchWhere
    },
    { userId },
    {
      price: {
        min: minPrice,
        max: maxPrice,
      },
    },
  );
  const totalRecords = await prisma.category.count();
  const { skip, take, totalPages } = pagination.getPagination(
    page,
    limit,
    totalRecords,
  );
  const whiteList = ["id", "name", "createdAt", "updatedAt"];
  const sorting = sort.getSorting(sortBy, order, whiteList);
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
    skip,
    take,
    orderBy: sorting,
  });
  return { categories, totalPages, totalRecords };
};

exports.getCategoryById = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(categoryId) },
    include: {
      products: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};
