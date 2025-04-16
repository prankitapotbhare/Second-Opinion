/**
 * Utility functions for data validation
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters'
    };
  }
  
  return { isValid: true };
};

/**
 * Validate user registration data
 * @param {Object} userData - User data
 * @returns {Object} Validation result with isValid and errors
 */
const validateUserData = (userData) => {
  const errors = {};
  
  // Validate name
  if (!userData.name || userData.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  // Validate email
  if (!userData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(userData.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Validate password
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  // Validate terms acceptance
  if (!userData.termsAccepted) {
    errors.termsAccepted = 'You must accept the terms and conditions';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  isValidEmail,
  validatePassword,
  validateUserData
};