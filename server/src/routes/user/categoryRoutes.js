const express = require('express');
const router = express.Router();

const categoryControllers = require('../../controllers/users/categoryControllers');
const authMiddleware = require('../../middleware/authMiddleware');


router.get('/categories', categoryControllers.getCategories);
router.get('/categories/:id', categoryControllers.getCategoryById);


module.exports = router;
