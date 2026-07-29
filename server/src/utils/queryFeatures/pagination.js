const getPagination = (page = 1, limit = 10, totalRecords = 0) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedPage) || parsedPage <= 0) {
    throw new Error("Invalid page number");
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
    throw new Error("Invalid limit");
  }

  const skip = (parsedPage - 1) * parsedLimit;

  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / parsedLimit) : 0;

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
    take: parsedLimit,
    totalRecords,
    totalPages,
  };
};


module.exports = {
  getPagination,
};