const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Token = require('../models/token.model');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generate access token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
exports.generateAccessToken = (userId, role = 'patient') => {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Generate refresh token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} JWT refresh token
 */
exports.generateRefreshToken = (userId, role = 'patient') => {
  return jwt.sign(
    { id: userId, role },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
};

/**
 * Generate random token
 * @returns {string} Random token
 */
exports.generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Calculate expiry date
 * @param {number} hours - Hours from now
 * @returns {Date} Expiry date
 */
exports.calculateExpiryDate = (hours) => {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
};

/**
 * Save a token to the database
 * @param {string} userId - User ID
 * @param {string} token - Token or OTP
 * @param {string} type - Token type (refresh, verification, reset)
 * @param {Date} expiresAt - Expiry date
 * @returns {Promise} Saved token document
 */
const saveToken = async (userId, token, type, expiresAt) => {
  const tokenDoc = new Token({
    userId,
    token,
    type,
    expiresAt
  });
  
  return await tokenDoc.save();
};

exports.saveToken = saveToken;