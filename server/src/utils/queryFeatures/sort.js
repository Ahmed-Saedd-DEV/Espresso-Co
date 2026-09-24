const resolveSortQuery = ({ sort, sortBy, order } = {}) => {
  const normalizedSort = sort || sortBy || "createdAt";
  const normalizedOrder = order || "asc";

  if (typeof normalizedSort !== "string") {
    throw new Error("Invalid sort field");
  }

  if (typeof normalizedOrder !== "string") {
    throw new Error("Invalid order value");
  }

  return {
    sort: normalizedSort,
    order: normalizedOrder,
  };
};

const getSorting = (sort, order, whiteList) => {
  const { sort: normalizedSort, order: normalizedOrder } = resolveSortQuery({
    sort,
    order,
  });

  if (!whiteList.includes(normalizedSort)) {
    throw new Error("Invalid sort field");
  }

  if (normalizedOrder !== "asc" && normalizedOrder !== "desc") {
    throw new Error("Invalid order value");
  }

  return { [normalizedSort]: normalizedOrder === "desc" ? "desc" : "asc" };
};

module.exports = {
  resolveSortQuery,
  getSorting,
};
