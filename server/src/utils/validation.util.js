/**
 * Utility functions for data validation
 */

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

/**
 * Utility functions for input validation
 */

/**
 * Check if a password meets strong password requirements
 * @param {string} password - Password to validate
 * @returns {boolean} True if password is strong
 */
const isStrongPassword = (password) => {
  // Password must be at least 8 characters long
  if (password.length < 8) {
    return false;
  }
  
  // Password must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  
  // Password must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }
  
  // Password must contain at least one number
  if (!/\d/.test(password)) {
    return false;
  }
  
  // Password must contain at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return false;
  }
  
  return true;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email format is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone format is valid
 */
const isValidPhone = (phone) => {
  // Basic phone validation - can be customized based on requirements
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

module.exports = {
  isStrongPassword,
  isValidEmail,
  isValidPhone,
  validatePassword,
  validateUserData
};