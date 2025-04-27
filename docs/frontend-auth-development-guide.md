# Frontend Authentication Development Guide

This document provides guidance for implementing authentication features in the Second Opinion frontend application, aligned with the backend authentication routes.

## Table of Contents
- [Authentication Architecture](#authentication-architecture)
- [Setup and Configuration](#setup-and-configuration)
- [Authentication Context](#authentication-context)
- [Registration Implementation](#registration-implementation)
- [Email Verification](#email-verification)
- [Login Implementation](#login-implementation)
- [Token Management](#token-management)
- [Password Reset](#password-reset)
- [Google OAuth Integration](#google-oauth-integration)
- [Protected Routes](#protected-routes)
- [Role-Based Access Control](#role-based-access-control)
- [Testing Authentication](#testing-authentication)

## Authentication Architecture

The authentication system follows this flow:
- Auth Pages → AuthContext → auth.api

Key components:
1. **Auth Pages**: User-facing components for registration, login, etc.
2. **AuthContext**: React context that manages authentication state
3. **auth.api**: Service that communicates with the backend API

## Setup and Configuration

### Environment Configuration

Create or update `.env.local` in the client directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### API Service Setup

Ensure your `auth.api.js` file is properly configured:

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.response = response;
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};
```

## Authentication Context

The `AuthContext` is the central piece that manages authentication state across your application.

### Implementation Guidelines

1. Create a context that tracks:
   - Current user
   - Authentication tokens
   - Loading state
   - Error state
   - Verification state

2. Provide methods for:
   - Registration
   - Login
   - Logout
   - Token refresh
   - Password reset
   - Email verification

### Example Implementation

```jsx
// src/contexts/AuthContext.jsx
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
  const [verificationState, setVerificationState] = useState({
    needsVerification: false,
    email: null
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        
        if (storedToken) {
          setAuthToken(storedToken);
          setRefreshToken(storedRefreshToken);
          
          // Fetch current user with the token
          const userData = await authApi.getCurrentUser(storedToken);
          setCurrentUser(userData.data.user);
        }
      } catch (error) {
        // Token might be invalid or expired, try to refresh
        try {
          const storedRefreshToken = localStorage.getItem('refreshToken');
          if (storedRefreshToken) {
            const tokens = await authApi.refreshToken(storedRefreshToken);
            handleAuthTokens(tokens.data.tokens);
            
            // Fetch user with new token
            const userData = await authApi.getCurrentUser(tokens.data.tokens.accessToken);
            setCurrentUser(userData.data.user);
          }
        } catch (refreshError) {
          // Clear invalid tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Helper to handle auth tokens
  const handleAuthTokens = (tokens, remember = true) => {
    setAuthToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    
    if (remember) {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    } else {
      // Use sessionStorage for session-only storage
      sessionStorage.setItem('accessToken', tokens.accessToken);
      sessionStorage.setItem('refreshToken', tokens.refreshToken);
    }
  };

  // Methods for authentication operations
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      
      // Set verification state to show verification page
      setVerificationState({
        needsVerification: true,
        email: userData.email
      });
      
      setLoading(false);
      return response;
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const verifyEmail = async (email, otp) => {
    setLoading(true);
    try {
      const response = await authApi.verifyEmail(email, otp);
      
      // The API now returns tokens upon successful verification
      const { user, tokens } = response.data;
      
      // Store tokens and user data
      handleAuthTokens(tokens);
      setCurrentUser(user);
      
      // Reset verification state
      setVerificationState({
        needsVerification: false,
        email: null
      });
      
      setLoading(false);
      return response;
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const login = async (email, password, rememberMe = false, expectedRole = null) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password, expectedRole);
      
      const { user, tokens } = response.data;
      
      // Store tokens and user data
      handleAuthTokens(tokens, rememberMe);
      setCurrentUser(user);
      
      setLoading(false);
      return response;
    } catch (error) {
      // Check if user needs verification
      if (error.data && error.data.needsVerification) {
        setVerificationState({
          needsVerification: true,
          email: error.data.email
        });
      }
      
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Call logout API if refresh token exists
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
      
      // Clear auth state
      setCurrentUser(null);
      setAuthToken(null);
      setRefreshToken(null);
      
      // Remove tokens from storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      
      setLoading(false);
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const refreshAuthToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authApi.refreshToken(refreshToken);
      handleAuthTokens(response.data.tokens);
      
      return response.data.tokens.accessToken;
    } catch (error) {
      // If refresh fails, log the user out
      await logout();
      throw error;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      return await authApi.requestPasswordReset(email);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      return await authApi.resetPassword(token, newPassword);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const resendVerification = async (email) => {
    try {
      return await authApi.resendVerification(email);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const googleAuth = async (idToken, userType = 'patient') => {
    setLoading(true);
    try {
      const response = await authApi.googleAuth(idToken, userType);
      
      const { user, tokens } = response.data;
      
      // Store tokens and user data
      handleAuthTokens(tokens);
      setCurrentUser(user);
      
      setLoading(false);
      return response;
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    authError,
    authToken,
    refreshToken,
    verificationState,
    register,
    verifyEmail,
    login,
    logout,
    refreshAuthToken,
    requestPasswordReset,
    resetPassword,
    resendVerification,
    googleAuth,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
```

## Registration Implementation

### User Registration Form

Create a registration form component that:
1. Collects user information (name, email, password)
2. Validates input fields
3. Handles form submission
4. Displays appropriate error messages
5. Redirects to verification page on success

### Example Implementation

```jsx
// src/app/(auth)/register/page.jsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail, validatePassword } from '@/utils/authUtils';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient', // Default role
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await register(formData);
      
      // Redirect to verification page
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      setErrors({
        ...errors,
        form: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
      
      {errors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Form fields implementation */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
```

## Email Verification

### Updated Email Verification Flow

The email verification process now returns authentication tokens upon successful verification, allowing users to be automatically logged in after verifying their email.

### API Service Methods

```javascript
// src/api/auth.api.js

// Verify email with OTP
export const verifyEmail = async (email, otp) => {
  const response = await fetch(`${API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, otp })
  });
  
  return handleResponse(response);
};

// Resend verification email
export const resendVerification = async (email) => {
  const response = await fetch(`${API_URL}/auth/resend-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
  
  return handleResponse(response);
};
```

### Email Verification Component

```jsx
// src/app/(auth)/verify-email/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const { verifyEmail, resendVerification, verificationState } = useAuth();
  const router = useRouter();
  
  // If no email in URL, use email from verification state
  useEffect(() => {
    if (!email && verificationState.email) {
      router.replace(`/verify-email?email=${encodeURIComponent(verificationState.email)}`);
    } else if (!email && !verificationState.email) {
      // No email to verify, redirect to login
      router.replace('/login');
    }
  }, [email, verificationState.email, router]);
  
  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // The verifyEmail method now handles setting tokens and user data
      await verifyEmail(email, otp);
      
      // Redirect to dashboard after successful verification
      router.push('/dashboard');
    } catch (error) {
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResend = async () => {
    if (countdown > 0) return;
    
    try {
      await resendVerification(email);
      setCountdown(60); // 60 second cooldown
      setError('');
    } catch (error) {
      setError(error.message || 'Failed to resend verification code');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Verify Your Email</h1>
      
      <p className="mb-4">
        We've sent a verification code to <strong>{email}</strong>.
        Please enter the code below to verify your email address.
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="otp" className="block text-gray-700 mb-2">Verification Code</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter 6-digit code"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 mb-4"
        >
          {isSubmitting ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
      
      <div className="text-center">
        <p className="mb-2">Didn't receive the code?</p>
        <button
          onClick={handleResend}
          disabled={countdown > 0}
          className="text-blue-500 hover:text-blue-700"
        >
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
```

## Login Implementation

### Login Form Component

```jsx
// src/app/(auth)/login/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: '' // Optional role filter
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, verificationState } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Pre-fill email from query params if available
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);
  
  // Redirect to verification page if needed
  useEffect(() => {
    if (verificationState.needsVerification && verificationState.email) {
      router.push(`/verify-email?email=${encodeURIComponent(verificationState.email)}`);
    }
  }, [verificationState, router]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(
        formData.email,
        formData.password,
        formData.rememberMe,
        formData.role || null
      );
      
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (error) {
      // If error is not related to verification, show it
      if (!(error.data && error.data.needsVerification)) {
        setError(error.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Log In</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your email"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your password"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 mb-2">Login As (Optional)</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Any Role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 mb-4"
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <div className="text-center">
        <p className="mb-2">
          <Link href="/forgot-password" className="text-blue-500 hover:text-blue-700">
            Forgot your password?
          </Link>
        </p>
        <p>
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:text-blue-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
```

## Token Management

### Token Refresh Strategy

The token refresh strategy should be implemented to:
1. Automatically refresh tokens before they expire
2. Handle token refresh on API calls that return 401 with tokenExpired flag
3. Maintain user session across page refreshes

### API Interceptor with Token Refresh

```javascript
// src/api/apiClient.js
import { useAuth } from '@/contexts/AuthContext';

export const createApiClient = () => {
  const { authToken, refreshAuthToken, logout } = useAuth();
  
  const apiClient = {
    fetch: async (url, options = {}) => {
      // Add auth token to request if available
      if (authToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authToken}`
        };
      }
      
      try {
        const response = await fetch(url, options);
        
        // If response is 401 and token expired, try to refresh
        if (response.status === 401) {
          const data = await response.json();
          
          if (data.tokenExpired) {
            // Try to refresh the token
            try {
              const newToken = await refreshAuthToken();
              
              // Retry the request with the new token
              options.headers = {
                ...options.headers,
                Authorization: `Bearer ${newToken}`
              };
              
              return fetch(url, options);
            } catch (refreshError) {
              // If refresh fails, logout and throw error
              await logout();
              throw new Error('Session expired. Please log in again.');
            }
          }
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    },
    
    // Helper methods for common HTTP methods
    get: async (url, options = {}) => {
      return apiClient.fetch(url, { ...options, method: 'GET' });
    },
    
    post: async (url, data, options = {}) => {
      return apiClient.fetch(url, {
        ...options,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data)
      });
    },
    
    // Add other methods as needed (PUT, DELETE, etc.)
  };
  
  return apiClient;
};
```

## Password Reset

### Password Reset Flow

The password reset flow consists of two steps:
1. Request password reset (sends email with reset link)
2. Reset password with token from email

### API Service Methods

```javascript
// src/api/auth.api.js

// Request password reset
export const requestPasswordReset = async (email) => {
  const response = await fetch(`${API_URL}/auth/request-password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
  
  return handleResponse(response);
};

// Reset password with token
export const resetPassword = async (token, password) => {
  const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password })
  });
  
  return handleResponse(response);
};
```

### Request Password Reset Component

```jsx
// src/app/(auth)/forgot-password/page.jsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const { requestPasswordReset } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (error) {
      setError(error.message || 'Failed to request password reset');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Check Your Email</h1>
        
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          If your email is registered with us, you will receive a password reset link shortly.
        </div>
        
        <p className="mb-4">
          Please check your email and follow the instructions to reset your password.
        </p>
        
        <div className="text-center mt-6">
          <Link href="/login" className="text-blue-500 hover:text-blue-700">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <p className="mb-4">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your email"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 mb-4"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      
      <div className="text-center">
        <Link href="/login" className="text-blue-500 hover:text-blue-700">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
```

### Reset Password Component

```jsx
// src/app/(auth)/reset-password/[token]/page.jsx
"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { validatePassword } from '@/utils/authUtils';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { resetPassword } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { token } = params;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Password Reset Successful</h1>
        
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Your password has been reset successfully.
        </div>
        
        <p className="mb-4">
          You will be redirected to the login page shortly.
        </p>
        
        <div className="text-center mt-6">
          <Link href="/login" className="text-blue-500 hover:text-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter new password"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Confirm new password"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 mb-4"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
```

## Google OAuth Integration

### Google OAuth Flow

The Google OAuth flow consists of:
1. User clicks "Sign in with Google" button
2. Google sign-in popup appears
3. User authenticates with Google
4. Google returns an ID token
5. Backend verifies the token and creates/logs in the user

### API Service Method

```javascript
// src/api/auth.api.js

// Google authentication
export const googleAuth = async (idToken, userType = 'patient') => {
  const response = await fetch(`${API_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ idToken, userType })
  });
  
  return handleResponse(response);
};
```

### Google Sign-In Button Component

```jsx
// src/components/GoogleSignInButton.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const GoogleSignInButton = ({ userType = 'patient', buttonText = 'Sign in with Google' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);
  
  const { googleAuth } = useAuth();
  const router = useRouter();
  
  // Load Google API script
  useEffect(() => {
    const loadGoogleScript = () => {
      // Check if script already exists
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        setGoogleLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleLoaded(true);
      document.body.appendChild(script);
    };
    
    loadGoogleScript();
  }, []);
  
  // Initialize Google Sign-In button
  useEffect(() => {
    if (!googleLoaded || !window.google) return;
    
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      setError('Google client ID is not configured');
      return;
    }
    
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: '100%', text: 'continue_with' }
      );
    } catch (error) {
      setError('Failed to initialize Google Sign-In');
      console.error(error);
    }
  }, [googleLoaded]);
  
  const handleCredentialResponse = async (response) => {
    if (!response.credential) {
      setError('Google authentication failed');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await googleAuth(response.credential, userType);
      router.push('/dashboard');
    } catch (error) {
      setError(error.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div 
        id="google-signin-button" 
        className={`w-full ${isLoading ? 'opacity-50' : ''}`}
      ></div>
      
      {isLoading && (
        <div className="text-center mt-2">
          <p>Authenticating...</p>
        </div>
      )}
    </div>
  );
};

export default GoogleSignInButton;
```

## Protected Routes

### Route Protection with Middleware

Next.js middleware can be used to protect routes based on authentication status and user roles.

```javascript
// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get auth tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password'
  ];
  
  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === '/'
  );
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // If no tokens are found, redirect to login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Allow access to protected routes if tokens exist
  return NextResponse.next();
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
```

### Protected Route Component

```jsx
// src/components/ProtectedRoute.jsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], // Empty array means any authenticated user can access
  redirectTo = '/login'
}) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Wait until auth state is loaded
    if (loading) return;
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }
    
    // If roles are specified, check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
      router.push('/unauthorized');
    }
  }, [currentUser, loading, isAuthenticated, allowedRoles, redirectTo, router]);
  
  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If not authenticated or doesn't have required role, don't render children
  if (!isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role))) {
    return null;
  }
  
  // Render children if authenticated and has required role
  return children;
};

export default ProtectedRoute;
```

## Role-Based Access Control

### Role-Based Route Protection

```jsx
// src/app/(dashboard)/doctor/page.jsx
"use client";

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

const DoctorDashboardPage = () => {
  return (
    <ProtectedRoute allowedRoles={['doctor']} redirectTo="/unauthorized">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
        {/* Doctor-specific content */}
      </div>
    </ProtectedRoute>
  );
};

export default DoctorDashboardPage;
```

### Role-Based UI Elements

```jsx
// src/components/RoleBasedElement.jsx
"use client";

import { useAuth } from '@/contexts/AuthContext';

const RoleBasedElement = ({ 
  children, 
  allowedRoles = [], 
  fallback = null 
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // If not authenticated, show fallback
  if (!isAuthenticated) {
    return fallback;
  }
  
  // If no roles specified, show for all authenticated users
  if (allowedRoles.length === 0) {
    return children;
  }
  
  // Show only if user has one of the allowed roles
  return allowedRoles.includes(currentUser?.role) ? children : fallback;
};

export default RoleBasedElement;
```

### Navigation with Role-Based Access

```jsx
// src/components/Navigation.jsx
"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import RoleBasedElement from './RoleBasedElement';

const Navigation = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Second Opinion
        </Link>
        
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
              
              <RoleBasedElement allowedRoles={['patient']}>
                <Link href="/patient/consultations" className="hover:text-blue-200">
                  My Consultations
                </Link>
              </RoleBasedElement>
              
              <RoleBasedElement allowedRoles={['doctor']}>
                <Link href="/doctor/appointments" className="hover:text-blue-200">
                  Appointments
                </Link>
              </RoleBasedElement>
              
              <RoleBasedElement allowedRoles={['admin']}>
                <Link href="/admin/users" className="hover:text-blue-200">
                  Manage Users
                </Link>
              </RoleBasedElement>
              
              <button 
                onClick={logout}
                className="hover:text-blue-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link href="/register" className="hover:text-blue-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
```

## Testing Authentication

### Unit Testing Auth Context

```javascript
// src/__tests__/contexts/AuthContext.test.jsx
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as authApi from '@/api/auth.api';

// Mock the auth API
jest.mock('@/api/auth.api');

// Test component that uses auth context
const TestComponent = () => {
  const { 
    currentUser, 
    login, 
    logout, 
    register, 
    verifyEmail,
    loading 
  } = useAuth();
  
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {currentUser ? (
            <>
              <p>Logged in as: {currentUser.email}</p>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => login('test@example.com', 'password')}>
                Login
              </button>
              <button onClick={() => register({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                role: 'patient',
                termsAccepted: true
              })}>
                Register
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    
    // Clear localStorage
    localStorage.clear();
  });
  
  test('renders loading state initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  test('handles login successfully', async () => {
    // Mock successful login
    authApi.login.mockResolvedValue({
      success: true,
      data: {
        user: { id: '123', email: 'test@example.com', role: 'patient' },
        tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' }
      }
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Click login button
    await act(async () => {
      userEvent.click(screen.getByText('Login'));
    });
    
    // Check if login was called
    expect(authApi.login).toHaveBeenCalledWith('test@example.com', 'password', false, null);
    
    // Check if user is logged in
    await waitFor(() => {
      expect(screen.getByText('Logged in as: test@example.com')).toBeInTheDocument();
    });
    
    // Check if tokens were stored
    expect(localStorage.getItem('accessToken')).toBe('access-token');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
  });
  
  // Add more tests for register, logout, verifyEmail, etc.
});
```

### Manual Testing Checklist

1. **Registration Testing**
   - [ ] Register as patient with valid data
   - [ ] Register as doctor with valid data
   - [ ] Try to register as admin (should fail)
   - [ ] Register with invalid email
   - [ ] Register with weak password
   - [ ] Register without accepting terms

2. **Email Verification Testing**
   - [ ] Verify email with valid OTP
   - [ ] Verify email with invalid OTP
   - [ ] Resend verification email
   - [ ] Check automatic login after verification

3. **Login Testing**
   - [ ] Login as patient
   - [ ] Login as doctor
   - [ ] Login with invalid credentials
   - [ ] Login with expected role
   - [ ] Login with wrong expected role

4. **Token Management Testing**
   - [ ] Access token refresh works automatically
   - [ ] Refresh token works when access token expires
   - [ ] Logout invalidates tokens

5. **Password Reset Testing**
   - [ ] Request password reset with valid email
   - [ ] Reset password with valid token
   - [ ] Reset password with invalid token
   - [ ] Reset password with expired token
   - [ ] Reset password with weak password

6. **Google OAuth Testing**
   - [ ] Login with Google as new patient
   - [ ] Login with Google as new doctor
   - [ ] Login with Google as existing user

7. **Protected Routes Testing**
   - [ ] Unauthenticated user redirected to login
   - [ ] User with wrong role redirected to unauthorized page
   - [ ] User with correct role can access protected page

8. **Role-Based UI Testing**
   - [ ] Patient-specific UI elements shown only to patients
   - [ ] Doctor-specific UI elements shown only to doctors
   - [ ] Admin-specific UI elements shown only to admins