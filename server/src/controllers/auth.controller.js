const authService = require('../services/auth.service');
// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { role, termsAccepted } = req.body;

    // Explicitly prevent admin registration through API
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is not allowed through the API'
      });
    }

    // Check if terms are accepted
    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the terms and conditions'
      });
    }

    const { user, verificationToken } = await authService.registerUser(req.body);

    // Create verification URL with email parameter
    const verificationUrl = `/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user._id,
        email: user.email,
        termsAccepted: user.termsAccepted,
        termsAcceptedAt: user.termsAcceptedAt,
        verificationToken, // In production, this would be sent via email
        verificationUrl // Include the full URL with email parameter
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

    // Create verification URL with email parameter
    const verificationUrl = `/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    res.status(200).json({
      success: true,
      message: 'Verification email sent',
      data: {
        verificationToken, // In production, this would be sent via email
        verificationUrl, // Include the full URL with email parameter
        email // Include the email in the response
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