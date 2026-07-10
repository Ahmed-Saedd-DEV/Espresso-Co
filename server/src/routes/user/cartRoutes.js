const express = require('express');
const router = express.Router();
const cartControllers = require('../../controllers/users/cartControllers');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/cart', authMiddleware, cartControllers.getCart);
router.post('/cart', authMiddleware, cartControllers.addToCart);
router.patch('/cart/:id', authMiddleware, cartControllers.updateCartItem);
router.delete('/cart/:id', authMiddleware, cartControllers.removeFromCart);

module.exports = router;