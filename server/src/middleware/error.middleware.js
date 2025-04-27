/**
 * Global error handling middleware
 */
const logger = require('../utils/logger.util');
const responseService = require('../services/response.service');

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.message}`, err);
  
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Additional error details for development environment
  const errorDetails = process.env.NODE_ENV !== 'production' ? { stack: err.stack } : null;
  
  // Send error response
  responseService.sendError(res, message, statusCode, errorDetails);
};

module.exports = { errorHandler };