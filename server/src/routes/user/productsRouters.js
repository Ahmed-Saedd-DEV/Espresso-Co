const express = require('express');
const router = express.Router();

const productControlles = require('../../controllers/users/productControllers');
const authMiddleware = require('../../middleware/authMiddleware');
const permit = require('../../middleware/permissionMiddleware');

router.get('/products', productControlles.getProducts);
router.get('/products/:id', productControlles.getProductById);


module.exports = router;
