/**
 * Authentication API service
 * Handles all authentication-related API calls to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Helper function to handle API responses
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} Parsed response data
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Create error object with additional response data
    const error = new Error(data.message || 'Something went wrong');
    error.response = response;
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export const register = async (userData) => {
  try {
    // Ensure terms are accepted
    if (!userData.termsAccepted) {
      userData.termsAccepted = true;
    }
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login response with user data and tokens
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user
 * @param {string} refreshToken - User's refresh token
 * @returns {Promise<Object>} Logout response
 */
export const logout = async (refreshToken) => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Refresh access token
 * @param {string} refreshToken - User's refresh token
 * @returns {Promise<Object>} New tokens
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Password reset request response
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Password reset token
 * @param {string} password - New password
 * @returns {Promise<Object>} Password reset response
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Verify email
 * @param {string} token - Email verification token
 * @returns {Promise<Object>} Email verification response
 */
export const verifyEmail = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise<Object>} Resend verification response
 */
export const resendVerification = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};

/**
 * Get current user profile
 * @param {string} token - Access token
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

/**
 * Google authentication
 * @param {string} idToken - Google ID token
 * @param {string} userType - User type (user, doctor)
 * @returns {Promise<Object>} Authentication response
 */
export const googleAuth = async (idToken, userType = 'user') => {
  try {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken, userType })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
};