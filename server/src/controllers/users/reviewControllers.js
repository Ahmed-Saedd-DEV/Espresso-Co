const reviewServices = require("../../services/user/reviewServices");

exports.createReview = async (req, res) => {
  try {
    const review = await reviewServices.createReview(req.body, req.user?.id);
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getReviews = async (req, res) => {
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
    res.status(400).json({ error: error.message });
  }
};
