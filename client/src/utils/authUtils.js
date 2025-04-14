/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Gets the dashboard URL for a user based on their role
 * @param {string} role - The user's role
 * @returns {string} - The dashboard URL
 */
export const getDashboardUrl = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'doctor':
      return '/doctor/dashboard';
    case 'user':
    default:
      return '/user/dashboard';
  }
};

/**
 * Gets the login URL for a user based on their role
 * @param {string} role - The user's role
 * @returns {string} - The login URL
 */
export const getLoginUrl = (role) => {
  switch (role) {
    case 'admin':
      return '/login/admin';
    case 'doctor':
      return '/login/doctor';
    case 'user':
    default:
      return '/login/user';
  }
};

/**
 * Formats a date for display
 * @param {Date|string} date - The date to format
 * @returns {string} - The formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};