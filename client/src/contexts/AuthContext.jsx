"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '@/api/auth.api';

// Create the auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [tokenRefreshTimer, setTokenRefreshTimer] = useState(null);

  // Check if user is already logged in (from localStorage or sessionStorage)
  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;
    
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const storedRefreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    
    if (storedUser && storedToken && storedRefreshToken) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setAuthToken(storedToken);
        setRefreshToken(storedRefreshToken);
        
        // Validate token and refresh if needed
        validateToken(storedToken, storedRefreshToken, rememberMe);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        clearAuthData();
      }
    } else {
      setLoading(false);
    }
    
    // Clean up token refresh timer on unmount
    return () => {
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }
    };
  }, []);
  
  // Set up token refresh timer when authToken changes
  useEffect(() => {
    if (authToken) {
      setupTokenRefreshTimer(authToken);
    }
  }, [authToken]);
  
  // Setup token refresh timer
  const setupTokenRefreshTimer = (token) => {
    // Clear any existing timer
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
    }
    
    try {
      // Decode token to get expiration time
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      // Calculate time until token needs refresh (5 minutes before expiration)
      const timeUntilRefresh = Math.max(0, expirationTime - currentTime - 5 * 60 * 1000);
      
      // Set timer to refresh token
      const timer = setTimeout(() => {
        if (refreshToken) {
          refreshUserToken(refreshToken);
        }
      }, timeUntilRefresh);
      
      setTokenRefreshTimer(timer);
    } catch (error) {
      console.error("Error setting up token refresh timer:", error);
    }
  };
  
  // Validate token and refresh if needed
  const validateToken = async (token, refresh, rememberMe = false) => {
    try {
      // Try to get current user with token
      const response = await authApi.getCurrentUser(token);
      if (response.success) {
        // Update user data if needed
        const userData = formatUserData(response.data.user);
        setCurrentUser(userData);
        
        // Store updated user data
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('currentUser', JSON.stringify(userData));
      }
      setLoading(false);
    } catch (error) {
      // If token is expired, try to refresh
      try {
        await refreshUserToken(refresh, rememberMe);
      } catch (refreshError) {
        // If refresh fails, clear auth data
        clearAuthData();
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Refresh user token
  const refreshUserToken = async (refresh, rememberMe = localStorage.getItem('rememberMe') === 'true') => {
    try {
      if (!refresh) {
        throw new Error('No refresh token available');
      }
      
      const response = await authApi.refreshToken(refresh);
      
      if (response.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
        
        setAuthToken(accessToken);
        setRefreshToken(newRefreshToken);
        
        // Update storage
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', accessToken);
        storage.setItem('refreshToken', newRefreshToken);
        
        // Try to get user data with new token
        try {
          const userResponse = await authApi.getCurrentUser(accessToken);
          if (userResponse.success) {
            const userData = formatUserData(userResponse.data.user);
            setCurrentUser(userData);
            storage.setItem('currentUser', JSON.stringify(userData));
          }
        } catch (userError) {
          console.error("Failed to get user data after token refresh:", userError);
        }
        
        return true;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      clearAuthData();
      throw error;
    }
  };
  
  // Format user data to match our app's structure
  const formatUserData = (user) => {
    return {
      uid: user._id || user.id,
      displayName: user.name,
      email: user.email,
      role: user.role,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      termsAccepted: user.termsAccepted,
      termsAcceptedAt: user.termsAcceptedAt
    };
  };
  
  // Clear all auth data
  const clearAuthData = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setRefreshToken(null);
    
    // Clear token refresh timer
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
      setTokenRefreshTimer(null);
    }
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.login(email, password);
      
      if (response.success) {
        const { user, tokens } = response.data;
        const { accessToken, refreshToken: newRefreshToken } = tokens;
        
        // Format user data
        const userData = formatUserData(user);
        
        setCurrentUser(userData);
        setAuthToken(accessToken);
        setRefreshToken(newRefreshToken);
        
        // Store in appropriate storage based on rememberMe
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('currentUser', JSON.stringify(userData));
        storage.setItem('authToken', accessToken);
        storage.setItem('refreshToken', newRefreshToken);
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
          // Clear localStorage if not using remember me
          if (!localStorage.getItem('rememberMe')) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
          }
        }
        
        setLoading(false);
        return { success: true, user: userData };
      }
      
      setLoading(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle verification needed error
      if (error.status === 401 && error.data && error.data.needsVerification) {
        setAuthError({
          message: 'Please verify your email before logging in',
          needsVerification: true,
          email: error.data.email
        });
        
        setLoading(false);
        return { 
          success: false, 
          error: error.data.message,
          needsVerification: true,
          email: error.data.email
        };
      }
      
      const errorMessage = error.message || 'An error occurred during login';
      setAuthError({ message: errorMessage });
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.register(userData);
      
      if (response.success) {
        setLoading(false);
        return { 
          success: true, 
          message: response.message,
          email: response.data.email,
          termsAccepted: response.data.termsAccepted,
          termsAcceptedAt: response.data.termsAcceptedAt
        };
      }
      
      setLoading(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle admin registration attempt
      if (error.status === 403) {
        const errorMessage = 'Admin registration is not allowed through the API';
        setAuthError({ message: errorMessage });
        setLoading(false);
        return { success: false, error: errorMessage };
      }
      
      const errorMessage = error.message || 'An error occurred during registration';
      setAuthError({ message: errorMessage });
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      setLoading(false);
      router.push('/login');
    }
  };

  // Verify email function
  const verifyEmail = async (token) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.verifyEmail(token);
      
      if (response.success) {
        setLoading(false);
        return { 
          success: true, 
          message: response.message,
          email: response.email // Include the email from the response
        };
      }
      
      setLoading(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Email verification error:', error);
      const errorMessage = error.message || 'An error occurred during email verification';
      setAuthError({ message: errorMessage });
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Resend verification email
  const resendVerification = async (email) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.resendVerification(email);
      
      if (response.success) {
        setLoading(false);
        return { success: true, message: response.message };
      }
      
      setLoading(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Resend verification error:', error);
      const errorMessage = error.message || 'An error occurred while resending verification email';
      setAuthError({ message: errorMessage });
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.requestPasswordReset(email);
      
      if (response.success) {
        setLoading(false);
        return { success: true, message: response.message };
      }
      
      setLoading(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Password reset request error:', error);
      const errorMessage = error.message || 'An error occurred while requesting password reset';
      setAuthError({ message: errorMessage });
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.resetPassword(token, password);
      
      if (response.success) {
        setLoading(false);
        return { success: true, message: response.message };
      }
      
      setLoading(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = error.message || 'An error occurred while resetting password';
      setAuthError({ message: errorMessage });
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Google authentication
  const googleAuth = async (idToken, userType = 'user', rememberMe = false) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.googleAuth(idToken, userType);
      
      if (response.success) {
        const { user, tokens, isNewUser } = response.data;
        const { accessToken, refreshToken: newRefreshToken } = tokens;
        
        // Format user data
        const userData = formatUserData(user);
        
        setCurrentUser(userData);
        setAuthToken(accessToken);
        setRefreshToken(newRefreshToken);
        
        // Store in appropriate storage based on rememberMe
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('currentUser', JSON.stringify(userData));
        storage.setItem('authToken', accessToken);
        storage.setItem('refreshToken', newRefreshToken);
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
          // Clear localStorage if not using remember me
          if (!localStorage.getItem('rememberMe')) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
          }
        }
        
        setLoading(false);
        return { 
          success: true, 
          user: userData, 
          isNewUser 
        };
      }
      
      setLoading(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Google auth error:', error);
      const errorMessage = error.message || 'An error occurred during Google authentication';
      setAuthError({ message: errorMessage });
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Context value
  const value = {
    currentUser,
    authToken,
    refreshToken,
    loading,
    authError,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    requestPasswordReset,
    resetPassword,
    refreshUserToken,
    clearAuthData,
    googleAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};