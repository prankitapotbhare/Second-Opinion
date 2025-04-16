/**
 * Utility functions for logging
 */

/**
 * Log info message
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 */
const info = (message, data = null) => {
  console.log(`[INFO] ${message}`, data ? data : '');
};

/**
 * Log error message
 * @param {string} message - Error message
 * @param {Error} error - Error object
 */
const error = (message, error = null) => {
  console.error(`[ERROR] ${message}`, error ? error.stack || error : '');
};

/**
 * Log warning message
 * @param {string} message - Warning message
 * @param {Object} data - Additional data
 */
const warn = (message, data = null) => {
  console.warn(`[WARN] ${message}`, data ? data : '');
};

/**
 * Log debug message (only in development)
 * @param {string} message - Debug message
 * @param {Object} data - Additional data
 */
const debug = (message, data = null) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG] ${message}`, data ? data : '');
  }
};

module.exports = {
  info,
  error,
  warn,
  debug
};