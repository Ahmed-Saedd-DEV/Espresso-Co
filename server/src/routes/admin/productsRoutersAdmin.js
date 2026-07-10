const express = require('express');
const router = express.Router();

const productControlles = require('../../controllers/admin/productControllersAdmin');
const authMiddleware = require('../../middleware/authMiddleware');
const permit = require('../../middleware/permissionMiddleware');


router.post('/products', authMiddleware, permit("ADMIN"), productControlles.createProduct);
router.patch('/products/:id', authMiddleware, permit("ADMIN"), productControlles.updateProduct);
router.delete('/products/:id', authMiddleware, permit("ADMIN"), productControlles.deleteProduct);

module.exports = router;
