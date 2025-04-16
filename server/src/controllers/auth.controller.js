const authService = require('../services/auth.service');
const responseUtil = require('../utils/response.util');
const logger = require('../utils/logger.util');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { role, termsAccepted } = req.body;

    // Explicitly prevent admin registration through API
    if (role === 'admin') {
      const { response, statusCode } = responseUtil.errorResponse(
        'Admin registration is not allowed through the API', 
        403
      );
      return res.status(statusCode).json(response);
    }

    // Check if terms are accepted
    if (!termsAccepted) {
      const { response, statusCode } = responseUtil.errorResponse(
        'You must accept the terms and conditions', 
        400
      );
      return res.status(statusCode).json(response);
    }

    const { user } = await authService.registerUser(req.body);

    const { response, statusCode } = responseUtil.successResponse(
      'User registered successfully. Please check your email to verify your account.',
      {
        userId: user._id,
        email: user.email,
        termsAccepted: user.termsAccepted,
        termsAcceptedAt: user.termsAcceptedAt
      },
      201
    );

    res.status(statusCode).json(response);
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
    
    // Get the user email from the token
    const userEmail = await authService.getUserEmailFromToken(token, 'verification');
    
    await authService.verifyEmail(token);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      email: userEmail // Include the email in the response
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
    
    await authService.requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: 'If your email is registered with us, you will receive a password reset link shortly.'
    });
  } catch (error) {
    // Don't expose whether the email exists or not for security
    res.status(200).json({
      success: true,
      message: 'If your email is registered with us, you will receive a password reset link shortly.'
    });
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
    
    await authService.resendVerification(email);

    res.status(200).json({
      success: true,
      message: 'If your email is unverified, a new verification email has been sent.'
    });
  } catch (error) {
    // Don't expose whether the email exists or verification status
    res.status(200).json({
      success: true,
      message: 'If your email is unverified, a new verification email has been sent.'
    });
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