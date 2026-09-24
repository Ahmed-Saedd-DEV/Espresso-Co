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
    const {
      page,
      limit,
      sort,
      order,
      rating,
      search: searchQuery,
      productId,
    } = req.query;

    const {
      reviews,
      totalPages,
      totalRecords,
      page: activePage,
      limit: activeLimit,
    } = await reviewServices.getReviews({
      page,
      limit,
      sort,
      order,
      rating,
      search: searchQuery,
      productId,
    });

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

exports.updateReview = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;
    const data = req.body;

    const updated = await reviewServices.updateReview(id, userId, data);
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    await reviewServices.deleteReview(id, userId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
