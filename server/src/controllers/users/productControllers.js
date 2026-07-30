const productService = require("../../services/user/productServices");

exports.getProducts = async (req, res) => {
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
      search: searchQuery,
    } = req.query;

    const {
      products,
      totalPages,
      totalRecords,
      page: activePage,
      limit: activeLimit,
    } = await productService.getProducts(
      {
        page,
        limit,
        sort,
        order,
        stock,
        price,
        minPrice,
        maxPrice,
        search: searchQuery,
      },
      { userId: req.user.id },
    );

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
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(
      req.params.id,
      req.user.id,
    );
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
