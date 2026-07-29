const prisma = require("../../prisma/prismaClient");
const pagination = require("../../utils/queryFeatures/pagination");
const sort = require("../../utils/queryFeatures/sort");
const filter = require("../../utils/queryFeatures/filter");
const search = require("../../utils/queryFeatures/search");
exports.getProducts = async (
  {
    page,
    limit,
    sortBy,
    order,
    stock,
    price,
    minPrice,
    maxPrice,
    search: searchQuery,
  },
  { userId },
) => {
  if (!userId) {
    throw new Error("Authentication required");
  }

  const searchWhiteList = ["name", "description"];

  const searchWhere = search.getSearch(
    searchQuery,
    searchWhiteList,
  );

  const where = filter.getFiltered(
    {
      stock: stock !== undefined ? Number(stock) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      ...searchWhere,
    },
    { userId },
    {
      price: {
        min: minPrice,
        max: maxPrice,
      },
    },
  );

  const totalRecords = await prisma.product.count({
    where,
  });

  const { skip, take, totalPages } =
    pagination.getPagination(
      page,
      limit,
      totalRecords,
    );

  const whiteList = [
    "name",
    "price",
    "stock",
    "createdAt",
    "updatedAt",
  ];

  const sorting = sort.getSorting(
    sortBy,
    order,
    whiteList,
  );

  const products = await prisma.product.findMany({
    where,
    skip,
    take,
    orderBy: sorting,
  });

  return {
    products,
    totalPages,
    totalRecords,
  };
};

exports.getProductById = async (productId, userId) => {
  if (!userId) {
    throw new Error("Authentication required");
  }

  const product = await prisma.product.findUnique({
    where: { id: Number(productId), userId },
  });
  return product;
};
