const prisma = require("../../prisma/prismaClient");
const pagination = require("../../utils/queryFeatures/pagination");
const sort = require("../../utils/queryFeatures/sort");
const filter = require("../../utils/queryFeatures/filter");
const search = require("../../utils/queryFeatures/search");
const redisClient = require("../../config/redis");
const {
  getProductsCacheKey,
  getProductsVersion,
} = require("../../utils/cache/productRateLimiter");
const AppError = require("../../utils/errors/AppError");

exports.getProducts = async ({
  page,
  limit,
  sort: sortField,
  order,
  stock,
  price,
  minPrice,
  maxPrice,
  category,
  categoryId,
  search: searchQuery,
}) => {
  const searchWhiteList = ["name", "description"];

  const searchWhere = search.getSearch(searchQuery, searchWhiteList);
  const categoryFilter =
    categoryId !== undefined
      ? { category: { id: Number(categoryId) } }
      : category
        ? { category: { name: category } }
        : {};

  const where = filter.getFiltered(
    {
      stock: stock !== undefined ? Number(stock) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      ...searchWhere,
      ...categoryFilter,
    },
    {},
    {
      price: {
        min: minPrice,
        max: maxPrice,
      },
    },
  );

  const whiteList = ["name", "price", "stock", "createdAt", "updatedAt"];

  const normalizedSort = sort.resolveSortQuery({
    sort: sortField,
    order,
  });

  const sorting = sort.getSorting(
    normalizedSort.sort,
    normalizedSort.order,
    whiteList,
  );

  const version = await getProductsVersion();

  const cacheKey = getProductsCacheKey({
    version,
    page,
    limit,
    sort: normalizedSort.sort,
    order: normalizedSort.order,
    stock,
    price,
    minPrice,
    maxPrice,
    category,
    categoryId,
    search: searchQuery,
  });

  const cachedProducts = await redisClient.get(cacheKey);

  if (cachedProducts) {
    return JSON.parse(cachedProducts);
  }

  // 2. Redis miss → query database
  const totalRecords = await prisma.product.count({
    where,
  });

  const paginationData = pagination.getPagination(page, limit, totalRecords);

  const products = await prisma.product.findMany({
    where,
    skip: paginationData.skip,
    take: paginationData.take,
    orderBy: sorting,
  });

  // 3. Build result
  const result = {
    products,
    totalPages: paginationData.totalPages,
    totalRecords,
    page: paginationData.page,
    limit: paginationData.limit,
  };

  // 4. Store in Redis
  await redisClient.set(cacheKey, JSON.stringify(result), {
    EX: 300,
  });

  return result;
};

exports.getProductById = async (productId) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};
