const User = require('../models/user.model');
const Token = require('../models/token.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
    const { name, email, password, role, specialization } = req.body;

    // Explicitly prevent admin registration through API
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is not allowed through the API'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user object based on role
    const userData = { name, email, password, role };
    
    // Add specialization for doctors
    if (role === 'doctor' && specialization) {
      userData.specialization = specialization;
    }

    // Create new user
    const user = await User.create(userData);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hours from now

    // Save verification token
    await Token.create({
      userId: user._id,
      token: verificationToken,
      type: 'verification',
      expiresAt: tokenExpiry
    });

    // In a real application, send verification email here
    // For now, just return the token for testing

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

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email: user.email
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);

    // Return user data and tokens
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          specialization: user.specialization
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Find the verification token
    const tokenDoc = await Token.findOne({
      token,
      type: 'verification',
      expiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user's email verification status
    await User.findByIdAndUpdate(tokenDoc.userId, { emailVerified: true });

    // Delete the used token
    await Token.findByIdAndDelete(tokenDoc._id);

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

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if token exists in database
    const tokenDoc = await Token.findOne({
      userId: decoded.id,
      token: refreshToken,
      type: 'refresh',
      expiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new tokens
    const tokens = await generateTokens(user._id);

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

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Delete the refresh token from database
    await Token.findOneAndDelete({ token: refreshToken, type: 'refresh' });

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

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // 1 hour from now

    // Save reset token
    await Token.findOneAndDelete({ userId: user._id, type: 'passwordReset' });
    await Token.create({
      userId: user._id,
      token: resetToken,
      type: 'passwordReset',
      expiresAt: tokenExpiry
    });

    // In a real application, send reset email here
    // For now, just return the token for testing

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

    // Find the reset token
    const tokenDoc = await Token.findOne({
      token,
      type: 'passwordReset',
      expiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update user's password
    const user = await User.findById(tokenDoc.userId);
    user.password = password;
    await user.save();

    // Delete the used token
    await Token.findByIdAndDelete(tokenDoc._id);

    // Delete all refresh tokens for this user
    await Token.deleteMany({ userId: user._id, type: 'refresh' });

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

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hours from now

    // Save verification token
    await Token.findOneAndDelete({ userId: user._id, type: 'verification' });
    await Token.create({
      userId: user._id,
      token: verificationToken,
      type: 'verification',
      expiresAt: tokenExpiry
    });

    // In a real application, send verification email here
    // For now, just return the token for testing

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
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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