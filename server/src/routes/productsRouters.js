const express = require('express');
const router = express.Router();

const productControlles = require('../controllers/productControllers');
const authMiddleware = require('../middleware/authMiddleware');
const permit = require("../middleware/permissionMiddleware");

router.get('/products', productControlles.getProducts);
router.get('/products/:id', productControlles.getProductById);
router.post('/products', authMiddleware, permit("ADMIN"), productControlles.createProduct);
router.patch('/products/:id', authMiddleware, permit("ADMIN"), productControlles.updateProduct);
router.delete('/products/:id', authMiddleware, permit("ADMIN"), productControlles.deleteProduct);

module.exports = router;
