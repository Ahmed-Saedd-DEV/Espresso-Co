const express = require('express');
const router = express.Router();

const categoryControllers = require('../../controllers/admin/categoryControllersAdmin');
const authMiddleware = require('../../middleware/authMiddleware');
const permit = require('../../middleware/permissionMiddleware');


router.post('/categories', authMiddleware, permit('ADMIN'), categoryControllers.createCategory);
router.patch('/categories/:id', authMiddleware, permit('ADMIN'), categoryControllers.updateCategory);
router.delete('/categories/:id', authMiddleware, permit('ADMIN'), categoryControllers.deleteCategory);


module.exports = router;
