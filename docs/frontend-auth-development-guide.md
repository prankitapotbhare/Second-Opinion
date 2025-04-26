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
    // Implementation details...
  }, []);

  // Methods for authentication operations
  const register = async (userData) => {
    // Implementation details...
  };

  const login = async (email, password, rememberMe = false, expectedRole = null) => {
    // Implementation details...
  };

  const logout = async () => {
    // Implementation details...
  };

  // Additional methods...

  const value = {
    currentUser,
    loading,
    authError,
    authToken,
    verificationState,
    register,
    login,
    logout,
    // Additional methods...
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

### Verification Page

Create a verification page that:
1. Accepts the OTP sent to the user's email
2. Provides option to resend verification email
3. Redirects to login page on successful verification

### Example Implementation

```jsx
// src/app/(auth)/verify-email/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const { verifyEmail, resendVerification } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await verifyEmail(email, otp);
      setSuccess('Email verified successfully! Redirecting to login...');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setCountdown(60); // 60 seconds cooldown
    setError('');
    
    try {
      await resendVerification(email);
      setSuccess('Verification email resent successfully!');
    } catch (error) {
      setError(error.message || 'Failed to resend verification email.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Verify Your Email</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <p className="mb-4">
        We've sent a verification code to <strong>{email}</strong>. 
        Please enter the code below to verify your email address.
      </p>
      
      <form onSubmit={handleVerify}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="otp">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter 6-digit code"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>Didn't receive the code?</p>
        <button
          onClick={handleResend}
          disabled={resendDisabled}
          className="text-blue-500 hover:text-blue-700 disabled:text-gray-400"
        >
          {resendDisabled 
            ? `Resend code (${countdown}s)` 
            : 'Resend verification code'}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
```

## Login Implementation

### Login Form

Create a login form component that:
1. Collects user credentials (email, password)
2. Provides "Remember me" option
3. Handles role-specific logins
4. Redirects to appropriate dashboard based on user role

### Example Implementation

```jsx
// src/app/(auth)/login/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardUrl } from '@/utils/authUtils';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, verificationState } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check for redirect parameter
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      // Store redirect URL for after login
      sessionStorage.setItem('redirectAfterLogin', redirect);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await login(email, password, rememberMe);
      
      // Check if user needs verification
      if (verificationState.needsVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      
      // Get redirect URL if exists
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        // Redirect to appropriate dashboard
        router.push(getDashboardUrl(result.user.role));
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Log In to Your Account</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your email"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your password"
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          
          <Link href="/forgot-password" className="text-blue-500 hover:text-blue-700">
            Forgot password?
          </Link>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
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

### Token Refresh Logic

Implement token refresh logic in the AuthContext:

```jsx
// Token refresh logic in AuthContext
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
    console.error('Error setting up token refresh timer:', error);
  }
};

// Function to refresh the token
const refreshUserToken = async (token) => {
  try {
    const result = await authApi.refreshToken(token);
    
    // Update tokens
    setAuthToken(result.accessToken);
    setRefreshToken(result.refreshToken);
    
    // Store tokens based on remember me preference
    const storage = localStorage.getItem('rememberMe') === 'true' 
      ? localStorage 
      : sessionStorage;
    
    storage.setItem('authToken', result.accessToken);
    storage.setItem('refreshToken', result.refreshToken);
    
    // Set up new refresh timer
    setupTokenRefreshTimer(result.accessToken);
  } catch (error) {
    // Handle token refresh failure
    console.error('Token refresh failed:', error);
    clearAuthData();
  }
};
```

## Password Reset

### Forgot Password Page

Create a forgot password page that:
1. Collects user email
2. Sends password reset request
3. Provides feedback to user

### Example Implementation

```jsx
// src/app/(auth)/forgot-password/page.jsx
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/authUtils';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await requestPasswordReset(email);
      setSuccess('Password reset instructions have been sent to your email.');
      setEmail('');
    } catch (error) {
      // For security reasons, we don't want to reveal if the email exists
      // So we show a success message even if the email doesn't exist
      setSuccess('If an account exists with this email, password reset instructions have been sent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reset Your Password</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <p className="mb-4">
        Enter your email address and we'll send you instructions to reset your password.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your email"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
```

### Reset Password Page

Create a reset password page that:
1. Accepts the reset token from URL
2. Allows user to enter new password
3. Validates password strength
4. Submits password reset request

### Example Implementation

```jsx
// src/app/(auth)/reset-password/[token]/page.jsx
"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { validatePassword } from '@/utils/authUtils';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { resetPassword } = useAuth();
  const router = useRouter();
  const params = useParams();
  const token = params.token;

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
      setSuccess('Password reset successful! Redirecting to login...');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Password reset failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reset Your Password</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter new password"
          />
          <p className="text-sm text-gray-500 mt-1">
            Password must be at least 8 characters long and include uppercase, lowercase, 
            numbers, and special characters.
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Confirm new password"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
```

## Google OAuth Integration

### Setup Google OAuth

1. Follow the instructions in `docs/GoogleOAuth.md` to set up Google OAuth credentials
2. Add the client ID to your environment variables

### Google Login Button Component

Create a reusable Google login button:

```jsx
// src/components/auth/GoogleLoginButton.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getDashboardUrl } from '@/utils/authUtils';

const GoogleLoginButton = ({ userType = 'patient' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { googleLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Load Google API script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    };
    
    const cleanup = loadGoogleScript();
    
    return cleanup;
  }, []);

  useEffect(() => {
    // Initialize Google One Tap when script is loaded
    if (window.google && !isLoading) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        cancel_on_tap_outside: true,
      });
    }
  }, [isLoading]);

  const handleGoogleResponse = async (response) => {
    if (!response.credential) {
      setError('Google authentication failed');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await googleLogin(response.credential, userType);
      
      // Redirect to appropriate dashboard
      router.push(getDashboardUrl(result.user.role));
    } catch (error) {
      setError(error.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google authentication is not available');
    }
  };

  return (
    <div>
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center bg-white border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isLoading ? 'Logging in...' : `Continue with Google as ${userType}`}
      </button>
    </div>
  );
};

export default GoogleLoginButton;
```

## Protected Routes

Create a ProtectedRoute component to secure routes that require authentication:

```jsx
// src/components/auth/ProtectedRoute.jsx
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // Helper function to check if user is authenticated
  const isAuthenticated = () => !!currentUser;
  
  // Helper function to check if user has a specific role
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        // If not authenticated, redirect to login with the current path as redirect parameter
        const currentPath = window.location.pathname;
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      } else if (allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) {
        // If authenticated but doesn't have the required role
        router.push('/unauthorized');
      }
    }
  }, [currentUser, loading, allowedRoles, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is authenticated and has the required role, render children
  if (isAuthenticated() && (allowedRoles.length === 0 || allowedRoles.some(role => hasRole(role)))) {
    return children;
  }

  // Return null while redirecting
  return null;
};

export default ProtectedRoute;
```

## Role-Based Access Control

### Role-Based Layout Structure

Organize your application with role-based layouts:

```jsx
// src/app/(patient)/layout.jsx
"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/auth';
import { PatientSidebar, PatientHeader } from '@/components/layout';

export default function PatientLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <div className="flex min-h-screen bg-gray-100">
        <PatientSidebar />
        <div className="flex-1">
          <PatientHeader />
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

```jsx
// src/app/(doctor)/layout.jsx
"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/auth';
import { DoctorSidebar, DoctorHeader } from '@/components/layout';

export default function DoctorLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div className="flex min-h-screen bg-gray-100">
        <DoctorSidebar />
        <div className="flex-1">
          <DoctorHeader />
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

```jsx
// src/app/(admin)/layout.jsx
"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/auth';
import { AdminSidebar, AdminHeader } from '@/components/layout';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

### Unauthorized Page

Create an unauthorized access page:

```jsx
// src/app/unauthorized/page.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardUrl } from '@/utils/authUtils';

const UnauthorizedPage = () => {
  const { currentUser } = useAuth();
  
  const dashboardUrl = currentUser ? getDashboardUrl(currentUser.role) : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <div className="text-6xl mb-4">🚫</div>
        <p className="text-gray-700 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <Link 
          href={dashboardUrl}
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
```

## Testing Authentication

### Manual Testing Checklist

Create a checklist for testing authentication features:

1. **Registration Testing**
   - [ ] Patient registration with valid data
   - [ ] Doctor registration with valid data
   - [ ] Admin registration (should fail)
   - [ ] Registration with invalid email
   - [ ] Registration with weak password
   - [ ] Registration without accepting terms
   - [ ] Registration with existing email

2. **Email Verification Testing**
   - [ ] Verify email with valid OTP
   - [ ] Verify email with invalid OTP
   - [ ] Verify email with expired OTP
   - [ ] Resend verification email

3. **Login Testing**
   - [ ] Patient login with valid credentials
   - [ ] Doctor login with valid credentials
   - [ ] Admin login with valid credentials
   - [ ] Login with unverified email
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

### Automated Testing

For automated testing, consider using tools like Cypress or Jest with React Testing Library:

```jsx
// Example Jest test for login component
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import { AuthProvider } from '@/contexts/AuthContext';
import { mockRouter } from '@/utils/test-utils';

// Mock the next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null)
  })
}));

describe('LoginPage', () => {
  beforeEach(() => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
  });

  test('renders login form', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('shows error when submitting empty form', async () => {
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email and password are required/i)).toBeInTheDocument();
    });
  });

  // Add more tests for different scenarios
});
```

## Conclusion

This guide provides a comprehensive approach to implementing authentication in your Second Opinion frontend application. By following these patterns and examples, you can create a secure, user-friendly authentication system that integrates seamlessly with your backend API.

Remember to:
1. Keep sensitive authentication logic in the AuthContext
2. Implement proper validation for all user inputs
3. Handle errors gracefully with user-friendly messages
4. Use role-based access control for protected routes
5. Test all authentication flows thoroughly

For additional security considerations, consider implementing:
- CSRF protection
- Rate limiting on the client side
- Security headers
- Secure storage of tokens
- Automatic session timeout