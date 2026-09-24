const productService = require("../../services/user/productServices");

exports.getProducts = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      sort,
      order,
      stock,
      price,
      minPrice,
      maxPrice,
      category,
      categoryId,
      search: searchQuery,
    } = req.query;

    const {
      products,
      totalPages,
      totalRecords,
      page: activePage,
      limit: activeLimit,
    } = await productService.getProducts({
      page,
      limit,
      sort,
      order,
      stock,
      price,
      minPrice,
      maxPrice,
      category,
      categoryId,
      search: searchQuery,
    });

    res.json({
      data: products,
      pagination: {
        page: activePage,
        limit: activeLimit,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};
