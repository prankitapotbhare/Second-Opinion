/**
 * Service for common validation functions
 */
const mongoose = require('mongoose');
const { createError } = require('../utils/error.util');

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @param {string} entityName - Name of the entity for error message
 * @throws {Error} If ID is invalid
 */
exports.validateObjectId = (id, entityName = 'resource') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(`Invalid ${entityName} ID: ${id}`, 400);
  }
};

/**
 * Validate required fields in request body
 * @param {Object} body - Request body
 * @param {Array} requiredFields - Array of required field names
 * @throws {Error} If any required field is missing
 */
exports.validateRequiredFields = (body, requiredFields) => {
  const missingFields = requiredFields.filter(field => !body[field]);
  
  if (missingFields.length > 0) {
    throw createError(`Missing required fields: ${missingFields.join(', ')}`, 400);
  }
};

/**
 * Validate field against allowed values
 * @param {any} value - Field value
 * @param {Array} allowedValues - Array of allowed values
 * @param {string} fieldName - Field name for error message
 * @throws {Error} If value is not in allowed values
 */
exports.validateAllowedValues = (value, allowedValues, fieldName) => {
  if (!allowedValues.includes(value)) {
    throw createError(
      `Invalid ${fieldName}. Allowed values: ${allowedValues.join(', ')}`,
      400
    );
  }
};

/**
 * Validate numeric field
 * @param {any} value - Field value
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {string} fieldName - Field name for error message
 * @throws {Error} If value is not a number or outside range
 */
exports.validateNumericField = (value, min, max, fieldName) => {
  const numValue = Number(value);
  
  if (isNaN(numValue)) {
    throw createError(`${fieldName} must be a number`, 400);
  }
  
  if (numValue < min || numValue > max) {
    throw createError(`${fieldName} must be between ${min} and ${max}`, 400);
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @throws {Error} If email format is invalid
 */
exports.validateEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw createError('Invalid email format', 400);
  }
};