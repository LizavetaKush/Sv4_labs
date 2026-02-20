const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Публичные маршруты
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Защищенные маршруты
router.get('/me', authenticateToken, authController.getMe);
router.put('/change-password', authenticateToken, authController.changePassword);

module.exports = router;
