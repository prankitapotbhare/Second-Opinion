/**
 * Global error handling middleware
 */
const logger = require('../utils/logger.util');

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.message}`, err);
  
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Create response object
  const responseObj = {
    success: false,
    message
  };
  
  // Additional error details for development environment
  if (process.env.NODE_ENV !== 'production') {
    if (err.stack) {
      responseObj.stack = err.stack;
    }
  }
  
  // Send error response directly
  return res.status(statusCode).json(responseObj);
};

module.exports = { errorHandler };