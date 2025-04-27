/**
 * Service for standardized API responses
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object|Array} data - Response data
 * @param {number} statusCode - HTTP status code
 * @param {number} count - Count for array data (optional)
 */
exports.sendSuccess = (res, message, data = null, statusCode = 200, count = null) => {
  const responseObj = {
    success: true,
    message
  };

  if (data !== null) {
    responseObj.data = data;
  }

  if (count !== null) {
    responseObj.count = count;
  }

  return res.status(statusCode).json(responseObj);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} errors - Detailed errors (optional)
 */
exports.sendError = (res, message, statusCode = 400, errors = null) => {
  const responseObj = {
    success: false,
    message
  };

  if (errors !== null) {
    responseObj.errors = errors;
  }

  // Add stack trace in development mode
  if (process.env.NODE_ENV !== 'production' && errors && errors.stack) {
    responseObj.stack = errors.stack;
  }

  return res.status(statusCode).json(responseObj);
};

/**
 * Send a paginated response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Array} data - Response data array
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items count
 * @param {number} statusCode - HTTP status code
 */
exports.sendPaginated = (res, message, data, page, limit, total, statusCode = 200) => {
  const totalPages = Math.ceil(total / limit);
  
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
};

/**
 * Send a not found response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
exports.sendNotFound = (res, message = 'Resource not found') => {
  return exports.sendError(res, message, 404);
};

/**
 * Send an unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
exports.sendUnauthorized = (res, message = 'Unauthorized access') => {
  return exports.sendError(res, message, 401);
};

/**
 * Send a forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
exports.sendForbidden = (res, message = 'Access denied') => {
  return exports.sendError(res, message, 403);
};