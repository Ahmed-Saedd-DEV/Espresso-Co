const getSearch = (search, whiteList) => {
  if (!search) {
    return {};
  }

  const fields = whiteList.filter((field) => typeof field === "string");

  if (fields.length === 0) {
    throw new Error("No searchable fields provided");
  }

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: search,
        mode: "insensitive",
      },
    })),
  };
};

module.exports = {
  getSearch,
};