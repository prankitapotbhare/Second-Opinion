const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { restrictAdminAuth } = require('../middleware/admin-restriction.middleware');

// Apply admin restriction middleware to all auth routes
router.use(restrictAdminAuth);

// Public routes
router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password/:token', authController.resetPassword);
// Google OAuth routes
router.post('/google', authController.googleAuth);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;