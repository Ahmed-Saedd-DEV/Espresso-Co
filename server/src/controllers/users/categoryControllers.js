const categoryService = require("../../services/user/categoryServices");

exports.getCategories = async (req, res) => {
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
      categoryId,
      search: searchQuery,
    } = req.query;
    const {
      categories,
      totalPages,
      totalRecords,
      page: activePage,
      limit: activeLimit,
    } = await categoryService.getCategories(
      {
        page,
        limit,
        sort,
        order,
        stock,
        price,
        minPrice,
        maxPrice,
        categoryId,
        search: searchQuery,
      },
      { userId: req.user.id },
    );
    res.status(200).json({
      data: categories,
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

exports.getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
