const express = require('express');
const router = express.Router();

const categoryControllers = require('../controllers/categoryControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/categories', categoryControllers.getCategories);
router.get('/categories/:id', categoryControllers.getCategoryById);
router.post('/categories', authMiddleware, categoryControllers.createCategory);
router.patch('/categories/:id', authMiddleware, categoryControllers.updateCategory);
router.delete('/categories/:id', authMiddleware, categoryControllers.deleteCategory);

module.exports = router;
