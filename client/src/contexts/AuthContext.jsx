"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '@/api/auth.api';

// Create the auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [tokenRefreshTimer, setTokenRefreshTimer] = useState(null);
  const [verificationState, setVerificationState] = useState({
    needsVerification: false,
    email: null,
    otpSent: false
  });

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
      isEmailVerified: user.isEmailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      termsAccepted: user.termsAccepted,
      termsAcceptedAt: user.termsAcceptedAt
    };
  };
  
  // Clear all auth data
  const clearAuthData = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setRefreshToken(null);
    setVerificationState({
      needsVerification: false,
      email: null,
      otpSent: false
    });
    
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
  const login = async (email, password, rememberMe = false, expectedRole = null) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.login(email, password, expectedRole);
      
      if (response.success) {
        const { user, tokens } = response.data;
        const { accessToken, refreshToken: newRefreshToken } = tokens;
        
        // Format user data
        const userData = formatUserData(user);
        
        // Check if user role matches expected role
        if (expectedRole && userData.role !== expectedRole) {
          setLoading(false);
          return { 
            success: false, 
            error: `This account is registered as a ${userData.role}. Please use the ${userData.role} login page.`,
            wrongRole: true,
            actualRole: userData.role
          };
        }
        
        // Check if email is verified
        if (!userData.isEmailVerified) {
          setVerificationState({
            needsVerification: true,
            email: email,
            otpSent: true
          });
          
          setLoading(false);
          return { 
            success: false, 
            error: 'Please verify your email before logging in.',
            needsVerification: true,
            email: email
          };
        }
        
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
      console.error("Login error:", error);
      
      // Check if the error contains verification information
      if (error.response && error.response.data && error.response.data.needsVerification) {
        setVerificationState({
          needsVerification: true,
          email: email,
          otpSent: true
        });
        
        setLoading(false);
        return { 
          success: false, 
          error: 'Please verify your email before logging in.',
          needsVerification: true,
          email: email
        };
      }
      
      setAuthError(error.message || 'An error occurred during login');
      setLoading(false);
      return { success: false, error: error.message || 'An error occurred during login' };
    }
  };

  // Register function
  const register = async (userData) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.register(userData);
      
      if (response.success) {
        // Set verification state to indicate email needs verification
        setVerificationState({
          needsVerification: true,
          email: userData.email,
          otpSent: true
        });
        
        setLoading(false);
        return { 
          success: true, 
          user: {
            email: userData.email,
            role: userData.role
          },
          needsVerification: true
        };
      }
      
      setLoading(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError(error.message || 'An error occurred during registration');
      setLoading(false);
      return { success: false, error: error.message || 'An error occurred during registration' };
    }
  };

  // Verify email with OTP
  const verifyEmail = async (email, otp) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.verifyEmail(email, otp);
      
      if (response.success) {
        const { user, tokens } = response.data;
        const { accessToken, refreshToken: newRefreshToken } = tokens;
        
        // Format user data
        const userData = formatUserData(user);
        
        setCurrentUser(userData);
        setAuthToken(accessToken);
        setRefreshToken(newRefreshToken);
        
        // Reset verification state
        setVerificationState({
          needsVerification: false,
          email: null,
          otpSent: false
        });
        
        // Store in sessionStorage (default for email verification)
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        sessionStorage.setItem('authToken', accessToken);
        sessionStorage.setItem('refreshToken', newRefreshToken);
        
        setLoading(false);
        return { success: true, user: userData };
      }
      
      setLoading(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error("Email verification error:", error);
      setAuthError(error.message || 'An error occurred during email verification');
      setLoading(false);
      return { success: false, error: error.message || 'An error occurred during email verification' };
    }
  };

  // Resend verification email
  const resendVerification = async (email) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.resendVerification(email);
      
      if (response.success) {
        // Update verification state
        setVerificationState({
          needsVerification: true,
          email: email,
          otpSent: true
        });
        
        setLoading(false);
        return { success: true };
      }
      
      setLoading(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error("Resend verification error:", error);
      setAuthError(error.message || 'An error occurred while resending verification');
      setLoading(false);
      return { success: false, error: error.message || 'An error occurred while resending verification' };
    }
  };

  // Google authentication
  const googleAuth = async (idToken, userType = 'user') => {
    setAuthError(null);
    setLoading(true);
    
    try {
      // Map 'user' type to 'patient' for backend compatibility
      const backendUserType = userType === 'user' ? 'patient' : userType;
      
      const response = await authApi.googleAuth(idToken, backendUserType);
      
      if (response.success) {
        const { user, tokens, isNewUser } = response.data;
        const { accessToken, refreshToken: newRefreshToken } = tokens;
        
        // Format user data
        const userData = formatUserData(user);
        
        setCurrentUser(userData);
        setAuthToken(accessToken);
        setRefreshToken(newRefreshToken);
        
        // Store in sessionStorage by default for Google auth
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        sessionStorage.setItem('authToken', accessToken);
        sessionStorage.setItem('refreshToken', newRefreshToken);
        
        setLoading(false);
        return { 
          success: true, 
          user: userData,
          isNewUser: isNewUser
        };
      }
      
      setLoading(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error("Google auth error:", error);
      setAuthError(error.message || 'An error occurred during Google authentication');
      setLoading(false);
      return { success: false, error: error.message || 'An error occurred during Google authentication' };
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
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.requestPasswordReset(email);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Password reset request error:", error);
      setAuthError(error.message || 'An error occurred while requesting password reset');
      setLoading(false);
      return { success: false, error: error.message || 'An error occurred while requesting password reset' };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const response = await authApi.resetPassword(token, password);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      setAuthError(error.message || 'An error occurred while resetting password');
      setLoading(false);
      return { success: false, error: error.message || 'An error occurred while resetting password' };
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    authError,
    authToken,
    refreshToken,
    verificationState,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    googleAuth,
    requestPasswordReset,
    resetPassword,
    refreshUserToken
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