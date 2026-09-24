const getPagination = (page = 1, limit = 10, totalRecords = 0) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const parsedTotalRecords = Number(totalRecords);

  if (!Number.isInteger(parsedPage) || parsedPage <= 0) {
    throw new Error("Invalid page number");
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
    throw new Error("Invalid limit");
  }

  if (!Number.isInteger(parsedTotalRecords) || parsedTotalRecords < 0) {
    throw new Error("Invalid totalRecords");
  }

  const skip = (parsedPage - 1) * parsedLimit;

  const totalPages = parsedTotalRecords > 0 ? Math.ceil(parsedTotalRecords / parsedLimit) : 0;

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
    take: parsedLimit,
    totalRecords: parsedTotalRecords,
    totalPages,
  };
};


module.exports = {
  getPagination,
};