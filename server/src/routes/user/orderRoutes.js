const express = require('express');
const router = express.Router();

const orderControllers = require('../../controllers/users/orderControllers');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/orders', authMiddleware, orderControllers.createOrder);


module.exports = router;