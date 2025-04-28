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
 * Validates a password against security requirements
 * @param {string} password - The password to validate
 * @returns {Object} Validation result with isValid flag and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character'
    };
  }
  
  // All checks passed
  return {
    isValid: true,
    message: 'Password meets all requirements'
  };
};

/**
 * Formats user data to a consistent structure
 * @param {Object} user - User data from API
 * @returns {Object} Formatted user data
 */
export const formatUserData = (user) => {
  return {
    uid: user._id || user.id,
    displayName: user.name,
    email: user.email,
    role: user.role,
    photoURL: user.photoURL,
    isEmailVerified: user.isEmailVerified,
    emailVerifiedAt: user.emailVerifiedAt,
    termsAccepted: user.termsAccepted,
    termsAcceptedAt: user.termsAcceptedAt
  };
};

/**
 * Creates a user avatar URL using UI Avatars service
 * @param {string} name - User's name
 * @param {string} color - Background color (hex without #)
 * @returns {string} - Avatar URL
 */
export const createAvatarUrl = (name, color = '3b82f6') => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff`;
};

/**
 * Generates a mock authentication token
 * @returns {string} - Mock token
 */
export const generateMockToken = () => {
  return `mock-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
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
    case "patient":
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
    case "patient":
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