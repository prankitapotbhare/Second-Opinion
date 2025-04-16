/**
 * Global error handling middleware
 */
const logger = require('../utils/logger.util');
const responseUtil = require('../utils/response.util');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message}`, err);
  
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  const { response } = responseUtil.errorResponse(
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );

  res.status(statusCode).json(response);
};

module.exports = { errorHandler };