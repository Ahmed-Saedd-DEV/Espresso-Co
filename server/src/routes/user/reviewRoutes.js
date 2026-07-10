const express = require('express');
const router = express.Router();

const reviewControllers = require('../../controllers/users/reviewControllers');
const authMiddleware = require('../../middleware/authMiddleware');


router.post('/reviews', authMiddleware, reviewControllers.createReview);

module.exports = router;