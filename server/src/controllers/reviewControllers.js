const reviewServices = require('../services/reviewServices');

exports.createReview = async (req, res) => {
    try {
        const review = await reviewServices.createReview(req.body, req.user?.id);
        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createReview: exports.createReview
};