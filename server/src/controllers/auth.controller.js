const User = require('../models/user.model');
const Token = require('../models/token.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authService = require('../services/auth.service');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Helper function to generate tokens
const generateTokens = async (userId) => {
  // Create access token
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

  // Create refresh token
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN
  });

  // Calculate expiry date for refresh token
  const refreshExpiry = new Date();
  refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days from now

  // Save refresh token in database
  await Token.findOneAndDelete({ userId, type: 'refresh' });
  await Token.create({
    userId,
    token: refreshToken,
    type: 'refresh',
    expiresAt: refreshExpiry
  });

  return { accessToken, refreshToken };
};

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { role } = req.body;

    // Explicitly prevent admin registration through API
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is not allowed through the API'
      });
    }

    const { user, verificationToken } = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user._id,
        email: user.email,
        verificationToken // In production, this would be sent via email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    try {
      const { user, tokens } = await authService.loginUser(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          tokens
        }
      });
    } catch (error) {
      if (error.needsVerification) {
        return res.status(401).json({
          success: false,
          message: error.message,
          needsVerification: true,
          email: error.email
        });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    await authService.verifyEmail(token);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    const tokens = await authService.refreshUserToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    await authService.logoutUser(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const resetToken = await authService.requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email',
      data: {
        resetToken // In production, this would be sent via email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    await authService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Resend verification email
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const verificationToken = await authService.resendVerification(email);

    res.status(200).json({
      success: true,
      message: 'Verification email sent',
      data: {
        verificationToken // In production, this would be sent via email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};