const express = require('express');
const router = express.Router();

const categoryControllers = require('../controllers/categoryControllers');
const authMiddleware = require('../middleware/authMiddleware');
const permit = require("../middleware/permissionMiddleware");

router.get('/categories', categoryControllers.getCategories);
router.get('/categories/:id', categoryControllers.getCategoryById);
router.post('/categories', authMiddleware, permit('ADMIN'), categoryControllers.createCategory);
router.patch('/categories/:id', authMiddleware, permit('ADMIN'), categoryControllers.updateCategory);
router.delete('/categories/:id', authMiddleware, permit('ADMIN'), categoryControllers.deleteCategory);

module.exports = router;
