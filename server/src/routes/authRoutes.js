const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', authControllers.registerUser);
router.post('/login', authControllers.loginUser);
router.get('/Profile', authMiddleware, authControllers.getProfile);
router.get('/logout', authControllers.logoutUser);

module.exports = router;