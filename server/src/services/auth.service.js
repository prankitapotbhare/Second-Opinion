const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const Admin = require('../models/admin.model');
const Token = require('../models/token.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('./email.service');
const tokenUtil = require('../utils/token.util');
const errorUtil = require('../utils/error.util');
const logger = require('../utils/logger.util');
const validationUtil = require('../utils/validation.util');
const { OAuth2Client } = require('google-auth-library');
const { getModelByRole } = require('../middleware/auth.middleware');

// Environment variables
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Initialize Google OAuth client
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Generate access and refresh tokens for a user
 * @param {string} userId - The user ID
 * @param {string} role - User role
 * @returns {Object} Object containing access and refresh tokens
 */
const generateTokens = async (userId, role) => {
  // Create access token
  const accessToken = tokenUtil.generateAccessToken(userId, role);

  // Create refresh token
  const refreshToken = tokenUtil.generateRefreshToken(userId, role);

  // Calculate expiry date for refresh token (7 days)
  const refreshExpiry = tokenUtil.calculateExpiryDate(24 * 7);

  // Save refresh token in database
  await tokenUtil.saveToken(userId, refreshToken, 'refresh', refreshExpiry);

  return { accessToken, refreshToken };
};

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} Registered user
 */
const registerUser = async (userData) => {
  try {
    const { name, email, password, role = 'patient', termsAccepted } = userData;

    // Validate email format
    if (!validationUtil.isValidEmail(email)) {
      throw errorUtil.createError('Invalid email format', 400);
    }

    // Validate password strength
    if (!validationUtil.isStrongPassword(password)) {
      throw errorUtil.createError(
        'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character',
        400
      );
    }
    
    // Check if user already exists in ANY model
    const existingPatient = await Patient.findOne({ email });
    const existingDoctor = await Doctor.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingPatient || existingDoctor || existingAdmin) {
      throw errorUtil.createError('User already exists with this email', 409);
    }
    
    // Get the appropriate model based on role
    const UserModel = getModelByRole(role);

    // Create user object with basic information
    const userObj = {
      name,
      email,
      password,
      termsAccepted,
      termsAcceptedAt: new Date()
    };

    // Create new user
    const user = new UserModel(userObj);

    // Save user
    await user.save();

    // Generate verification token
    const verificationOTP = generateOTP();
    const otpExpiry = tokenUtil.calculateExpiryDate(1); // 1 hours

    // Save verification token
    await tokenUtil.saveToken(user._id, verificationOTP, 'verification', otpExpiry);

    // Send verification email
    await emailService.sendVerificationEmail(user.email, user.name, verificationOTP);

    return { user };
  } catch (error) {
    logger.error('Error in registerUser service:', error);
    throw error;
  }
};

/**
 * Verify a user's email using OTP
 * @param {string} email - User email
 * @param {string} otp - Verification OTP
 * @returns {Object} Object containing user and tokens
 */
const verifyEmail = async (email, otp) => {
  if (!email || !otp) {
    throw errorUtil.validationError('Email and OTP are required');
  }

  // Find the user by email
  let user = null;
  
  // Try each model in sequence
  user = await Patient.findOne({ email });
  if (user) userModel = Patient;
  
  if (!user) {
    user = await Doctor.findOne({ email });
    if (user) userModel = Doctor;
  }
  
  if (!user) {
    user = await Admin.findOne({ email });
    if (user) userModel = Admin;
  }
  
  if (!user) {
    throw errorUtil.createError('User not found', 404);
  }
  
  // Check if email is already verified
  if (user.isEmailVerified) {
    throw errorUtil.createError('Email is already verified', 400);
  }
  
  // Find the verification token
  const tokenDoc = await Token.findOne({
    userId: user._id,
    token: otp,
    type: 'verification',
    expiresAt: { $gt: new Date() }
  });
  
  if (!tokenDoc) {
    throw errorUtil.createError('Invalid or expired OTP', 400);
  }
  
  // Mark email as verified
  user.isEmailVerified = true;
  user.emailVerifiedAt = new Date();
  await user.save();
  
  // Delete the verification token
  await Token.deleteOne({ _id: tokenDoc._id });
  
  // Generate authentication tokens
  const tokens = await generateTokens(user._id, user.role);
  
  // Return user and tokens
  return { 
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoURL: user.photoURL,
      isEmailVerified: user.isEmailVerified,
    }, 
    tokens
  };
};

/**
 * Resend verification OTP
 * @param {string} email - User email
 */
const resendVerification = async (email) => {
  if (!email) {
    throw errorUtil.validationError('Email is required');
  }

  // Find the user by email
  let user = null;
  let userRole = null;
  
  // Try each model in sequence
  user = await Patient.findOne({ email });
  if (user) userRole = 'patient';
  
  if (!user) {
    user = await Doctor.findOne({ email });
    if (user) userRole = 'doctor';
  }
  
  if (!user) {
    user = await Admin.findOne({ email });
    if (user) userRole = 'admin';
  }
  
  if (!user) {
    throw errorUtil.notFoundError('User not found');
  }

  // Check if email is already verified
  if (user.isEmailVerified) {
    throw errorUtil.validationError('Email is already verified');
  }

  // Delete any existing verification tokens for this user
  await Token.deleteMany({ userId: user._id, type: 'verification' });

  // Generate new verification OTP
  const verificationOTP = generateOTP();
  const otpExpiry = tokenUtil.calculateExpiryDate(1); // 1 hour expiry

  // Save verification OTP
  await tokenUtil.saveToken(user._id, verificationOTP, 'verification', otpExpiry);

  // Send verification email with OTP
  await emailService.sendVerificationEmail(user.email, user.name, verificationOTP, userRole);

  return true;
};

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (optional)
 * @returns {Object} User data and tokens
 */
const loginUser = async (email, password, role = null) => {
  // If role is specified, try that model first
  let user = null;
  let userRole = role;

  if (role) {
    const UserModel = getModelByRole(role);
    user = await UserModel.findOne({ email });
  } else {
    // Try each model in sequence
    user = await Patient.findOne({ email });
    if (user) userRole = 'patient';
    
    if (!user) {
      user = await Doctor.findOne({ email });
      if (user) userRole = 'doctor';
    }
    
    if (!user) {
      user = await Admin.findOne({ email });
      if (user) userRole = 'admin';
    }
  }

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  if (userRole !== 'admin' && !user.isEmailVerified) {
    const error = new Error('Please verify your email before logging in');
    error.statusCode = 401;
    error.needsVerification = true;
    error.email = user.email;
    throw error;
  }

  const tokens = await generateTokens(user._id, userRole);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: userRole,
      photoURL: user.photoURL,
      isEmailVerified: user.isEmailVerified,
    },
    tokens,
  };
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

  // Get the appropriate model based on role
  const UserModel = getModelByRole(decoded.role || 'patient');
  
  // Check if user exists
  const user = await UserModel.findById(decoded.id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 401;
    throw error;
  }

  // Generate new tokens
  return await generateTokens(user._id, decoded.role || 'patient');
};

/**
 * Request a password reset
 * @param {string} email - User email
 * @returns {string} Reset token
 */
const requestPasswordReset = async (email) => {
  // Check if user exists in any model
  let user = null;
  let userRole = null;
  
  user = await Patient.findOne({ email });
  if (user) userRole = 'patient';
  
  if (!user) {
    user = await Doctor.findOne({ email });
    if (user) userRole = 'doctor';
  }
  
  if (!user) {
    user = await Admin.findOne({ email });
    if (user) userRole = 'admin';
  }
  
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
    await emailService.sendPasswordResetEmail(user.email, user.name, resetToken, userRole);
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

  // Try to update password in each model
  let updated = false;
  
  try {
    // Try Patient model first
    const patient = await Patient.findById(tokenDoc.userId);
    if (patient) {
      patient.password = password;
      await patient.save();
      updated = true;
    }
    
    // Try Doctor model if not found in Patient
    if (!updated) {
      const doctor = await Doctor.findById(tokenDoc.userId);
      if (doctor) {
        doctor.password = password;
        await doctor.save();
        updated = true;
      }
    }
    
    // Try Admin model if not found in others
    if (!updated) {
      const admin = await Admin.findById(tokenDoc.userId);
      if (admin) {
        admin.password = password;
        await admin.save();
        updated = true;
      }
    }
    
    if (!updated) {
      throw new Error('User not found');
    }
  } catch (error) {
    logger.error('Error resetting password:', error);
    throw error;
  }

  // Delete the used token
  await Token.findByIdAndDelete(tokenDoc._id);

  // Delete all refresh tokens for this user
  await Token.deleteMany({ userId: tokenDoc.userId, type: 'refresh' });
};

/**
 * Authenticate with Google
 * @param {string} idToken - Google ID token
 * @param {string} userType - User type (patient, doctor)
 * @returns {Object} User data and tokens
 */
const admin = require('../config/firebase-admin');

// Replace the existing googleAuth function
const googleAuth = async (idToken, userType = 'patient') => {
  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Extract user info from decoded token
    const { email, name, picture, email_verified } = decodedToken;
    
    // Check if user exists in any model
    let user = null;
    let actualUserRole = null;
    
    // Try each model in sequence to find the user
    user = await Patient.findOne({ email });
    if (user) actualUserRole = 'patient';
    
    if (!user) {
      user = await Doctor.findOne({ email });
      if (user) actualUserRole = 'doctor';
    }
    
    if (!user) {
      user = await Admin.findOne({ email });
      if (user) actualUserRole = 'admin';
    }
    
    // If user exists, verify that the requested role matches the actual role
    if (user && actualUserRole !== userType) {
      throw errorUtil.authError(`This email is registered as a ${actualUserRole}. Please sign in with the correct account type.`);
    }
    
    // If user doesn't exist, create a new one with the specified role
    let isNewUser = false;
    
    if (user) {
      // If user exists but doesn't have Firebase as auth provider, update the user
      if (!user.firebaseUid) {
        user.firebaseUid = decodedToken.uid;
        user.photoURL = picture || user.photoURL;
        await user.save();
      }
    } else {
      // Create new user
      isNewUser = true;
      
      // Validate user type
      if (!['patient', 'doctor'].includes(userType)) {
        throw errorUtil.validationError('Invalid user type');
      }
      
      // Determine which model to use for new user
      const UserModel = getModelByRole(userType);
      
      // Create user with Firebase data
      user = await UserModel.create({
        name,
        email,
        firebaseUid: decodedToken.uid,
        password: crypto.randomBytes(20).toString('hex'), // Random password for Firebase users
        photoURL: picture,
        isEmailVerified: email_verified,
        emailVerifiedAt: new Date(),
        termsAccepted: true,
        termsAcceptedAt: new Date()
      });
      
      actualUserRole = userType;
    }
    
    // Generate tokens
    const tokens = await generateTokens(user._id, actualUserRole);
    
    // Format user data for response
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: actualUserRole,
      photoURL: user.photoURL,
      isEmailVerified: user.isEmailVerified,
      termsAccepted: user.termsAccepted,
      termsAcceptedAt: user.termsAcceptedAt
    };
    
    return { user: userData, tokens, isNewUser };
  } catch (error) {
    logger.error('Firebase authentication error:', error);
    
    if (error.message.includes('auth/id-token-expired')) {
      throw errorUtil.authError('Firebase token expired. Please try again.');
    }
    
    throw error; // Pass through custom errors like role mismatch
  }
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
 * Get current user
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {Object} User data
 */
const getCurrentUser = async (userId, role) => {
  const UserModel = getModelByRole(role);
  
  const user = await UserModel.findById(userId).select('-password');
  
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

  // Try to find user in each model
  let user = null;
  
  user = await Patient.findById(tokenDoc.userId);
  
  if (!user) {
    user = await Doctor.findById(tokenDoc.userId);
  }
  
  if (!user) {
    user = await Admin.findById(tokenDoc.userId);
  }
  
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
  getUserEmailFromToken,
  googleAuth,
  getModelByRole,
  generateOTP
};