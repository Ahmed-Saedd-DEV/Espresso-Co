const express = require('express');
const router = express.Router();

const productControlles = require('../controllers/productControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/products', productControlles.getProducts);
router.get('/products/:id', productControlles.getProductById);
router.post('/products', authMiddleware, productControlles.createProduct);
router.patch('/products/:id', authMiddleware, productControlles.updateProduct);
router.delete('/products/:id', authMiddleware, productControlles.deleteProduct);

module.exports = router;
