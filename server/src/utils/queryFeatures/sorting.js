const getSorting = (sort, order, whiteList) => {
    if (!sort) {
        sort = "createdAt";
    }
    if (!whiteList.includes(sort)) {
        throw new Error("Invalid sort field");
    }
    const sortBy = sort;

    if (!order) {
        order = "asc";
    }

    if (order !== "asc" && order !== "desc") {
        throw new Error("Invalid order value");
    }
    const sortOrder = order === "desc" ? "desc" : "asc";

    return { [sortBy]: sortOrder };
};
