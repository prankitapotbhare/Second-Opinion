/**
 * Utility functions for error handling
 */

/**
 * Create an API error with status code
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Error} Error object with statusCode
 */
const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Authentication error
 * @param {string} message - Error message
 * @returns {Error} Error object with statusCode 401
 */
const authError = (message = 'Authentication failed') => {
  return createError(message, 401);
};

/**
 * Forbidden error
 * @param {string} message - Error message
 * @returns {Error} Error object with statusCode 403
 */
const forbiddenError = (message = 'Access denied') => {
  return createError(message, 403);
};

/**
 * Not found error
 * @param {string} message - Error message
 * @returns {Error} Error object with statusCode 404
 */
const notFoundError = (message = 'Resource not found') => {
  return createError(message, 404);
};

/**
 * Validation error
 * @param {string} message - Error message
 * @returns {Error} Error object with statusCode 400
 */
const validationError = (message = 'Validation failed') => {
  return createError(message, 400);
};

module.exports = {
  createError,
  authError,
  forbiddenError,
  notFoundError,
  validationError
};