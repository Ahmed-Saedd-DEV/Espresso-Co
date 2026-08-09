const PRODUCTS_VERSION_KEY = "products:version";

const getProductsCacheKey = ({
  version,
  page,
  limit,
  sort,
  order,
  stock,
  price,
  minPrice,
  maxPrice,
  search,
}) => {
  return `products:v${version}:page=${page}:limit=${limit}:sort=${sort}:order=${order}:stock=${stock ?? "none"}:price=${price ?? "none"}:minPrice=${minPrice ?? "none"}:maxPrice=${maxPrice ?? "none"}:search=${search ?? "none"}`;
};

const getProductsVersion = async () => {
  let version = await redisClient.get(PRODUCTS_VERSION_KEY);

  if (!version) {
    await redisClient.set(PRODUCTS_VERSION_KEY, "1");
    version = "1";
  }

  return version;
};

const invalidateProductsCache = async () => {
  await redisClient.incr(PRODUCTS_VERSION_KEY);
};

module.exports = {
  getProductsCacheKey,
  getProductsVersion,
  invalidateProductsCache,
};
