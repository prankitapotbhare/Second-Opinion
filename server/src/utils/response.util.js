/**
 * Utility functions for API responses
 */

/**
 * Create a success response
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted success response
 */
const successResponse = (message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message
  };

  if (data) {
    response.data = data;
  }

  return { response, statusCode };
};

/**
 * Create an error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} additionalInfo - Additional error information
 * @returns {Object} Formatted error response
 */
const errorResponse = (message, statusCode = 400, additionalInfo = null) => {
  const response = {
    success: false,
    message
  };

  if (additionalInfo) {
    Object.assign(response, additionalInfo);
  }

  return { response, statusCode };
};

module.exports = {
  successResponse,
  errorResponse
};