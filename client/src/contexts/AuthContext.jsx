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

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (storedUser && storedToken && storedRefreshToken) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setAuthToken(storedToken);
        setRefreshToken(storedRefreshToken);
        
        // Validate token and refresh if needed
        validateToken(storedToken, storedRefreshToken);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        clearAuthData();
      }
    } else {
      setLoading(false);
    }
  }, []);
  
  // Validate token and refresh if needed
  const validateToken = async (token, refresh) => {
    try {
      // Try to get current user with token
      await authApi.getCurrentUser(token);
      setLoading(false);
    } catch (error) {
      // If token is expired, try to refresh
      try {
        const response = await authApi.refreshToken(refresh);
        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
        
        setAuthToken(accessToken);
        setRefreshToken(newRefreshToken);
        
        // Update localStorage
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        setLoading(false);
      } catch (refreshError) {
        // If refresh fails, clear auth data
        clearAuthData();
        setLoading(false);
      }
    }
  };
  
  // Clear all auth data
  const clearAuthData = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setRefreshToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
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
        
        // Format user data to match our app's structure
        const userData = {
          uid: user.id,
          displayName: user.name,
          email: user.email,
          role: user.role,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          specialization: user.specialization
        };
        
        setCurrentUser(userData);
        setAuthToken(accessToken);
        setRefreshToken(newRefreshToken);
        
        // Store in localStorage or sessionStorage based on rememberMe
        if (rememberMe) {
          // Store in localStorage for persistence across browser sessions
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          localStorage.setItem('rememberMe', 'true');
        } else {
          // Store in sessionStorage for current session only
          sessionStorage.setItem('currentUser', JSON.stringify(userData));
          sessionStorage.setItem('authToken', accessToken);
          sessionStorage.setItem('refreshToken', newRefreshToken);
          // Clear localStorage to prevent conflicts
          localStorage.removeItem('currentUser');
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('rememberMe');
        }
        
        // Return success
        return { success: true, user: userData };
      }
      
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'An error occurred during login';
      setAuthError(errorMessage);
      
      // Check if it's a verification error
      if (errorMessage.includes('verify your email')) {
        return { 
          success: false, 
          error: errorMessage,
          needsVerification: true,
          email: email
        };
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData, userType) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.register(userData, userType);
      
      if (response.success) {
        // Return success with email for verification
        return { success: true, email: userData.email };
      }
      
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.message || 'An error occurred during signup';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (refreshToken) {
        // Call the logout API
        await authApi.logout(refreshToken);
      }
      
      // Clear all auth data
      clearAuthData();
      
      // Return success
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local data
      clearAuthData();
      return { success: false, error: error.message || 'Failed to logout' };
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    setLoading(true);
    try {
      const response = await authApi.requestPasswordReset(email);
      
      if (response.success) {
        return { success: true, resetToken: response.data.resetToken };
      }
      
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message || 'Failed to send reset link' };
    } finally {
      setLoading(false);
    }
  };

  // Verify email function
  const verifyEmail = async (token) => {
    setLoading(true);
    try {
      const response = await authApi.verifyEmail(token);
      
      if (response.success) {
        return { success: true };
      }
      
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: error.message || 'An error occurred during verification' };
    } finally {
      setLoading(false);
    }
  };

  // Set new password after reset
  const setNewPassword = async (token, newPassword) => {
    setLoading(true);
    try {
      const response = await authApi.resetPassword(token, newPassword);
      
      if (response.success) {
        return { success: true };
      }
      
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Set new password error:', error);
      return { success: false, error: error.message || 'Failed to reset password' };
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email) => {
    setLoading(true);
    try {
      const response = await authApi.resendVerificationEmail(email);
      
      if (response.success) {
        return { success: true };
      }
      
      return { success: false, error: response.message };
    } catch (error) {
      console.error('Resend verification error:', error);
      return { success: false, error: error.message || 'Failed to resend verification email' };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser && !!authToken && !!refreshToken;
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  const value = {
    currentUser,
    loading,
    authError,
    authToken,
    login,
    signup,
    logout,
    resetPassword,
    verifyEmail,
    setNewPassword,
    resendVerificationEmail,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};