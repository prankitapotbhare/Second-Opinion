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

    // Set default role to patient if not specified
    if (!role) {
      req.body.role = 'patient';
    }

    const { user } = await authService.registerUser(req.body);

    const { response, statusCode } = responseUtil.successResponse(
      'User registered successfully. Please check your email to verify your account.',
      {
        userId: user._id,
        email: user.email,
        role: req.body.role,
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

// Verify email with OTP
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }
    
    // Updated to get user and tokens from the service
    const { user, tokens } = await authService.verifyEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user,
        tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

// Resend verification email
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    await authService.resendVerification(email);

    res.status(200).json({
      success: true,
      message: 'If your email is unverified, a new verification OTP has been sent.'
    });
  } catch (error) {
    // Don't expose whether the email exists or verification status
    // for security reasons, always return a generic success message
    res.status(200).json({
      success: true,
      message: 'If your email is unverified, a new verification OTP has been sent.'
    });
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    try {
      const { user, tokens } = await authService.loginUser(email, password, role);

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

// Google Authentication
exports.googleAuth = async (req, res, next) => {
  try {
    const { idToken, userType } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    // Validate user type
    if (userType && !['patient', 'doctor'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const result = await authService.googleAuth(idToken, userType || 'patient');

    res.status(200).json({
      success: true,
      message: 'Google SignIn successful',
      data: {
        user: result.user,
        tokens: result.tokens,
        isNewUser: result.isNewUser
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

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id, req.user.role);

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