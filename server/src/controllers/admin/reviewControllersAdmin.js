const reviewServicesAdmin = require("../../services/admin/reviewServicesAdmin");

const getAllReviews = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      sort,
      order,
      rating,
      search: searchQuery,
      productId,
    } = req.query;

    const result = await reviewServicesAdmin.getAllReviews({
      page,
      limit,
      searchQuery,
      rating,
      productId,
      sort,
      order,
    });

    res
      .status(200)
      .json({
        data: result.reviews,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          totalRecords: result.totalRecords,
        },
      });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    await reviewServicesAdmin.deleteReview(id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteManyReviews = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const result = await reviewServicesAdmin.deleteManyReviews(ids);
    res
      .status(200)
      .json({
        message: `${result.deletedCount} review(s) deleted successfully`,
        deletedCount: result.deletedCount,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviews,
  deleteReview,
  deleteManyReviews,
};
