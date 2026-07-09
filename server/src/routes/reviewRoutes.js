const express = require('express');
const router = express.Router();

const orderControllers = require('../controllers/orderControllers');
const reviewControllers = require('../controllers/reviewControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/orders', authMiddleware, orderControllers.createOrder);
router.post('/reviews', authMiddleware, reviewControllers.createReview);
router.post('/', authMiddleware, reviewControllers.createReview);

module.exports = router;