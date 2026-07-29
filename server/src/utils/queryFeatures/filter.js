const getFiltered = (filters = {}, baseWhere = {}, ranges = {}) => {
  const where = { ...baseWhere };

  // Exact-match / Numeric / Enum filters
  for (const [field, value] of Object.entries(filters)) {
    if (value !== undefined) {
      where[field] = value;
    }
  }

  // Range filters
  for (const [field, range] of Object.entries(ranges)) {
    const rangeFilter = {};

    if (range.min !== undefined) {
      rangeFilter.gte = Number(range.min);
    }

    if (range.max !== undefined) {
      rangeFilter.lte = Number(range.max);
    }

    if (Object.keys(rangeFilter).length > 0) {
      where[field] = rangeFilter;
    }
  }

  return where;
};

module.exports = {
  getFiltered,
};