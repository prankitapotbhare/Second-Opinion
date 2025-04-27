/**
 * Utility functions for token management
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Token = require('../models/token.model');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generate a random token
 * @param {number} length - Token length in bytes
 * @returns {string} Random hex token
 */
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate JWT access token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Generate JWT refresh token
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - Secret key
 * @returns {Object} Decoded token
 */
const verifyToken = (token, secret = JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
};

/**
 * Save token to database
 * @param {string} userId - User ID
 * @param {string} token - Token string
 * @param {string} type - Token type
 * @param {Date} expiresAt - Expiry date
 * @returns {Promise} Saved token document
 */
const saveToken = async (userId, token, type, expiresAt) => {
  // Delete any existing tokens of the same type for this user
  await Token.findOneAndDelete({ userId, type });
  
  // Create new token
  return await Token.create({
    userId,
    token,
    type,
    expiresAt
  });
};

/**
 * Find token in database
 * @param {Object} query - Query object
 * @returns {Promise} Token document
 */
const findToken = async (query) => {
  return await Token.findOne(query);
};

/**
 * Delete token from database
 * @param {Object} query - Query object
 * @returns {Promise} Deletion result
 */
const deleteToken = async (query) => {
  return await Token.findOneAndDelete(query);
};

/**
 * Calculate token expiry date
 * @param {number} hours - Hours from now
 * @returns {Date} Expiry date
 */
const calculateExpiryDate = (hours) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

module.exports = {
  generateRandomToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  saveToken,
  findToken,
  deleteToken,
  calculateExpiryDate
};