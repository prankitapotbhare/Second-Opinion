const User = require('../models/user.model');
const Token = require('../models/token.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('./email.service');
const tokenUtil = require('../utils/token.util');
const errorUtil = require('../utils/error.util');
const logger = require('../utils/logger.util');
const validationUtil = require('../utils/validation.util');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generate access and refresh tokens for a user
 * @param {string} userId - The user ID
 * @returns {Object} Object containing access and refresh tokens
 */
const generateTokens = async (userId) => {
  // Create access token
  const accessToken = tokenUtil.generateAccessToken(userId);

  // Create refresh token
  const refreshToken = tokenUtil.generateRefreshToken(userId);

  // Calculate expiry date for refresh token (7 days)
  const refreshExpiry = tokenUtil.calculateExpiryDate(24 * 7);

  // Save refresh token in database
  await tokenUtil.saveToken(userId, refreshToken, 'refresh', refreshExpiry);

  return { accessToken, refreshToken };
};

/**
 * Register a new user
 * @param {Object} userData - User data including name, email, password, role
 * @returns {Object} Created user and verification token
 */
const registerUser = async (userData) => {
  // Validate user data
  const validation = validationUtil.validateUserData(userData);
  if (!validation.isValid) {
    throw errorUtil.validationError(Object.values(validation.errors)[0]);
  }

  const { name, email, password, role, termsAccepted } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw errorUtil.validationError('Email already registered');
  }

  // Create user object
  const userObj = { 
    name, 
    email, 
    password, 
    role,
    termsAccepted: true,
    termsAcceptedAt: new Date()
  };
  
  // Create new user
  const user = await User.create(userObj);

  // Generate verification token
  const verificationToken = tokenUtil.generateRandomToken();
  const tokenExpiry = tokenUtil.calculateExpiryDate(24); // 24 hours

  // Save verification token
  await tokenUtil.saveToken(user._id, verificationToken, 'verification', tokenExpiry);

  // Send verification email
  try {
    await emailService.sendVerificationEmail(user.email, user.name, verificationToken);
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    // Continue with registration even if email fails
  }

  return { user };
};

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} User data and tokens
 */
const loginUser = async (email, password) => {
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // Check if password is correct
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // Check if email is verified
  if (!user.emailVerified) {
    const error = new Error('Please verify your email before logging in');
    error.statusCode = 401;
    error.needsVerification = true;
    error.email = user.email;
    throw error;
  }

  // Generate tokens
  const tokens = await generateTokens(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    },
    tokens
  };
};

/**
 * Verify a user's email
 * @param {string} token - Verification token
 */
const verifyEmail = async (token) => {
  // Find the verification token
  const tokenDoc = await Token.findOne({
    token,
    type: 'verification',
    expiresAt: { $gt: new Date() }
  });

  if (!tokenDoc) {
    const error = new Error('Invalid or expired verification token');
    error.statusCode = 400;
    throw error;
  }

  // Update user's email verification status
  await User.findByIdAndUpdate(tokenDoc.userId, { emailVerified: true });

  // Delete the used token
  await Token.findByIdAndDelete(tokenDoc._id);
};

/**
 * Refresh user tokens
 * @param {string} refreshToken - Refresh token
 * @returns {Object} New access and refresh tokens
 */
const refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token is required');
    error.statusCode = 400;
    throw error;
  }

  // Verify the refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch (error) {
    const err = new Error('Invalid refresh token');
    err.statusCode = 401;
    throw err;
  }

  // Check if token exists in database
  const tokenDoc = await Token.findOne({
    userId: decoded.id,
    token: refreshToken,
    type: 'refresh',
    expiresAt: { $gt: new Date() }
  });

  if (!tokenDoc) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }

  // Check if user exists
  const user = await User.findById(decoded.id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 401;
    throw error;
  }

  // Generate new tokens
  return await generateTokens(user._id);
};

/**
 * Logout a user
 * @param {string} refreshToken - Refresh token
 */
const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token is required');
    error.statusCode = 400;
    throw error;
  }

  // Delete the refresh token from database
  await Token.findOneAndDelete({ token: refreshToken, type: 'refresh' });
};

/**
 * Request a password reset
 * @param {string} email - User email
 * @returns {string} Reset token
 */
const requestPasswordReset = async (email) => {
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    // For security, don't reveal if the email exists or not
    return null;
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

  // Send password reset email
  try {
    await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    // Continue with reset process even if email fails
  }

  return resetToken;
};

/**
 * Reset a user's password
 * @param {string} token - Reset token
 * @param {string} password - New password
 */
const resetPassword = async (token, password) => {
  // Find the reset token
  const tokenDoc = await Token.findOne({
    token,
    type: 'passwordReset',
    expiresAt: { $gt: new Date() }
  });

  if (!tokenDoc) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    throw error;
  }

  // Update user's password
  const user = await User.findById(tokenDoc.userId);
  user.password = password;
  await user.save();

  // Delete the used token
  await Token.findByIdAndDelete(tokenDoc._id);

  // Delete all refresh tokens for this user
  await Token.deleteMany({ userId: user._id, type: 'refresh' });
};

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {string} Verification token
 */
const resendVerification = async (email) => {
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    // For security, don't reveal if the email exists or not
    return null;
  }

  // Check if email is already verified
  if (user.emailVerified) {
    // For security, don't reveal verification status
    return null;
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = new Date();
  tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hours from now

  // Delete any existing verification tokens
  await Token.findOneAndDelete({ userId: user._id, type: 'verification' });

  // Save new verification token
  await Token.create({
    userId: user._id,
    token: verificationToken,
    type: 'verification',
    expiresAt: tokenExpiry
  });

  // Send verification email
  try {
    await emailService.sendVerificationEmail(user.email, user.name, verificationToken);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // Continue with process even if email fails
  }

  return verificationToken;
};

/**
 * Get current user
 * @param {string} userId - User ID
 * @returns {Object} User data
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Get user email from a token
 * @param {string} token - The token
 * @param {string} tokenType - The token type ('verification', 'passwordReset', etc.)
 * @returns {string} User email
 */
const getUserEmailFromToken = async (token, tokenType) => {
  // Find the token
  const tokenDoc = await Token.findOne({
    token,
    type: tokenType
  });

  if (!tokenDoc) {
    const error = new Error('Invalid token');
    error.statusCode = 400;
    throw error;
  }

  // Get the user
  const user = await User.findById(tokenDoc.userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user.email;
};

module.exports = {
  generateTokens,
  registerUser,
  loginUser,
  verifyEmail,
  refreshUserToken,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  resendVerification,
  getCurrentUser,
  getUserEmailFromToken // Add the new function to exports
};