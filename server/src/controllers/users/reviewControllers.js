const reviewServices = require("../../services/user/reviewServices");

exports.createReview = async (req, res, next) => {
  try {
    const review = await reviewServices.createReview(req.body, req.user?.id);
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const { page, limit, sort, order, rating, search: searchQuery } = req.query;

    const {
      reviews,
      totalPages,
      totalRecords,
      page: activePage,
      limit: activeLimit,
    } = await reviewServices.getReviews(
      { page, limit, sort, order, rating, search: searchQuery },
      { userId: req.user.id },
    );

    res.status(200).json({
      data: reviews,
      pagination: {
        page: activePage,
        limit: activeLimit,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
