# Frontend Authentication Development Guide

This guide provides a comprehensive approach to implementing authentication in the frontend of the Second Opinion application, working with the existing backend authentication system.

## Table of Contents

1. [Authentication Flow Overview](#authentication-flow-overview)
2. [Implementation Checklist](#implementation-checklist)
3. [Authentication Context Setup](#authentication-context-setup)
4. [API Integration](#api-integration)
5. [Authentication Components](#authentication-components)
6. [Route Protection](#route-protection)
7. [User Role Management](#user-role-management)
8. [Testing Authentication](#testing-authentication)
9. [Security Best Practices](#security-best-practices)

## Authentication Flow Overview

The Second Opinion application supports the following authentication flows:

1. **Registration & Email Verification**
   - User registers with email/password
   - System sends verification email with OTP
   - User verifies email with OTP
   - User can now log in

2. **Login Flow**
   - User logs in with email/password
   - System returns access and refresh tokens
   - Frontend stores tokens securely

3. **Token Management**
   - Access token used for API requests
   - Refresh token used to get new access tokens
   - Logout invalidates tokens

4. **Password Reset**
   - User requests password reset
   - System sends reset email with token
   - User sets new password with token

5. **Google OAuth**
   - User authenticates with Google
   - System creates/logs in user
   - Returns tokens for authenticated session

6. **Role-Based Access**
   - Different user types: patient, doctor, admin
   - Each role has specific access permissions
   - Admin accounts have special restrictions

## Implementation Checklist

- [ ] Set up Authentication Context
- [ ] Implement API service for auth endpoints
- [ ] Create login forms for different user types
- [ ] Build registration flow with email verification
- [ ] Implement password reset functionality
- [ ] Add Google OAuth integration
- [ ] Create protected route components
- [ ] Implement role-based access control
- [ ] Add token refresh mechanism
- [ ] Build logout functionality

## Authentication Context Setup

Create an AuthContext to manage authentication state throughout the application:

```jsx
// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  login, logout, refreshToken, register, verifyEmail,
  requestPasswordReset, resetPassword, getCurrentUser, googleAuth
} from '@/api/auth.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshTokenValue = localStorage.getItem('refreshToken');
        
        if (!accessToken && refreshTokenValue) {
          // Try to refresh the token
          const result = await refreshToken(refreshTokenValue);
          if (result.success) {
            localStorage.setItem('accessToken', result.data.tokens.accessToken);
            localStorage.setItem('refreshToken', result.data.tokens.refreshToken);
            
            // Get user data
            const userData = await getCurrentUser(result.data.tokens.accessToken);
            setCurrentUser(userData.data.user);
          }
        } else if (accessToken) {
          // Get user data with existing token
          const userData = await getCurrentUser(accessToken);
          setCurrentUser(userData.data.user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear potentially invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Login function
  const handleLogin = async (email, password, userType = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await login(email, password, userType);
      
      if (result.success) {
        const { user, tokens } = result.data;
        
        // Store tokens
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        // Update state
        setCurrentUser(user);
        return { success: true, user };
      }
    } catch (error) {
      setError(error.message || 'Login failed');
      return { 
        success: false, 
        error: error.message,
        needsVerification: error.needsVerification,
        email: error.email
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Register function
  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await register(userData);
      return { success: true, data: result.data };
    } catch (error) {
      setError(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Email verification
  const handleVerifyEmail = async (email, otp) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await verifyEmail(email, otp);
      
      if (result.success) {
        const { user, tokens } = result.data;
        
        // Store tokens
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        // Update state
        setCurrentUser(user);
        return { success: true, user };
      }
    } catch (error) {
      setError(error.message || 'Verification failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Resend verification email
  const resendVerification = async (email, redirectPath) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await resendVerificationEmail(email, redirectPath);
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to resend verification');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Password reset request
  const handleRequestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      await requestPasswordReset(email);
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to request password reset');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password
  const handleResetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    
    try {
      await resetPassword(token, password);
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to reset password');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Google authentication
  const handleGoogleAuth = async (idToken, userType = 'patient', redirectPath = '/dashboard') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await googleAuth(idToken, userType, redirectPath);
      
      if (result.success) {
        const { user, tokens } = result.data;
        
        // Store tokens
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        // Update state
        setCurrentUser(user);
        return { success: true, user, isNewUser: result.data.isNewUser };
      }
    } catch (error) {
      setError(error.message || 'Google authentication failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const handleLogout = async () => {
    setLoading(true);
    
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        await logout(refreshTokenValue);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user state regardless of API success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setCurrentUser(null);
      setLoading(false);
    }
  };
  
  // Check if user has a specific role
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    verifyEmail: handleVerifyEmail,
    resendVerification,
    requestPasswordReset: handleRequestPasswordReset,
    resetPassword: handleResetPassword,
    googleAuth: handleGoogleAuth,
    logout: handleLogout,
    hasRole
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## API Integration

The auth.api.js file already exists in your project. Make sure it includes all necessary authentication endpoints:

```jsx
// Additional functions to add to src/api/auth.api.js if not already present

/**
 * Verify email with OTP
 * @param {string} email - User email
 * @param {string} otp - Verification OTP
 * @returns {Promise<Object>} Verification response
 */
export const verifyEmail = async (email, otp) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp })
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
 * @param {string} redirectPath - Path to redirect after verification
 * @returns {Promise<Object>} Resend verification response
 */
export const resendVerificationEmail = async (email, redirectPath = '/dashboard') => {
  try {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, redirectPath })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};
```

## Authentication Components

### Login Form Component

Enhance the existing LoginForm component to handle different user types:

```jsx
// src/app/(auth)/components/LoginForm.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDivider } from './common';
import { GoogleLoginButton } from './social';
import { validateEmail } from '@/utils/authUtils';

const LoginForm = ({ 
  userType = 'user',
  redirectPath = '/dashboard',
  hideOptions = false
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  
  const router = useRouter();
  const { login, resendVerification } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(email, password, userType);
      
      if (result.success) {
        // Redirect to appropriate dashboard based on user role
        router.push(redirectPath);
      } else if (result.needsVerification) {
        setNeedsVerification(true);
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendVerification = async () => {
    setIsLoading(true);
    
    try {
      await resendVerification(email, redirectPath);
      setError(null);
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      {needsVerification ? (
        <div className="text-center">
          <div className="mb-4 p-4 bg-yellow-50 text-yellow-800 rounded-md">
            <p>Your email is not verified. Please check your inbox for a verification email.</p>
          </div>
          <button
            onClick={handleResendVerification}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
          >
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </button>
          <p className="mt-4 text-sm text-gray-600">
            <Link href="/login" className="text-blue-600 hover:underline">
              Try a different account
            </Link>
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          {!hideOptions && (
            <>
              <AuthDivider text="or continue with" />
              
              <div className="mt-4">
                <GoogleLoginButton 
                  userType={userType} 
                  redirectPath={redirectPath}
                />
              </div>
              
              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href={`/signup/${userType !== 'user' ? userType : ''}`}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LoginForm;
```

### Registration Form Component

Create a comprehensive registration form:

```jsx
// src/app/(auth)/components/RegisterForm.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDivider } from './common';
import { GoogleLoginButton } from './social';
import { validateEmail, validatePassword } from '@/utils/authUtils';

const RegisterForm = ({ 
  userType = 'user',
  redirectPath = '/dashboard'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const { register } = useAuth();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate terms acceptance
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare registration data
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType === 'user' ? 'patient' : userType,
        termsAccepted: formData.termsAccepted
      };
      
      const result = await register(userData);
      
      if (result.success) {
        setSuccess(true);
        // Redirect to success page
        router.push(`/signup/success?email=${encodeURIComponent(formData.email)}&type=${userType}&redirect=${redirectPath}`);
      } else {
        setGeneralError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {generalError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {generalError}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="termsAccepted"
              name="termsAccepted"
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${errors.termsAccepted ? 'border-red-500' : ''}`}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="termsAccepted" className={`font-medium ${errors.termsAccepted ? 'text-red-700' : 'text-gray-700'}`}>
              I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </label>
            {errors.termsAccepted && <p className="mt-1 text-sm text-red-600">{errors.termsAccepted}</p>}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 disabled:opacity-70"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <AuthDivider text="or continue with" />
      
      <div className="mt-4">
        <GoogleLoginButton 
          userType={userType === 'user' ? 'patient' : userType} 
          redirectPath={redirectPath}
          isSignUp={true}
        />
      </div>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link 
          href={`/login/${userType !== 'user' ? userType : ''}`}
          className="text-blue-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
```

### Google Login Button Component

Create a component for Google authentication:

```jsx
// src/app/(auth)/components/social/GoogleLoginButton.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = ({ 
  userType = 'patient', 
  redirectPath = '/dashboard',
  isSignUp = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const { googleAuth } = useAuth();
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This is a placeholder for the actual Google authentication
      // In a real implementation, you would use the Google Identity Services SDK
      // to get an ID token and then pass it to your backend
      
      // Example with Google Identity Services:
      // 1. Load the Google Identity Services SDK in your _app.js or layout
      // 2. Initialize the Google Sign-In client
      // 3. Get the ID token from Google
      // 4. Pass the ID token to your backend
      
      // Mock implementation for demonstration:
      const mockGoogleAuth = async () => {
        // In a real implementation, this would be the ID token from Google
        const idToken = "mock-google-id-token";
        
        // Call your backend with the ID token
        const result = await googleAuth(idToken, userType, redirectPath);
        
        if (result.success) {
          // Redirect to appropriate dashboard based on user role
          router.push(redirectPath);
        } else {
          setError(result.error || 'Google authentication failed');
        }
      };
      
      await mockGoogleAuth();
      
    } catch (error) {
      setError('Google authentication failed. Please try again.');
      console.error('Google auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200 disabled:opacity-70"
      >
        <FcGoogle className="h-5 w-5" />
        <span>{isLoading ? 'Processing...' : isSignUp ? 'Sign up with Google' : 'Sign in with Google'}</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
```

### Password Reset Components

Create components for the password reset flow:

```jsx
// src/app/(auth)/forgot-password/page.jsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthHeader } from '../components';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/authUtils';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { requestPasswordReset } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate email
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset request error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <AuthHeader 
          title="Forgot Password" 
          subtitle="Enter your email to receive a password reset link"
        />
        
        {success ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
              <p>If your email is registered with us, you will receive a password reset link shortly.</p>
              <p className="mt-2">Please check your inbox and spam folder.</p>
            </div>
            <Link 
              href="/login"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 disabled:opacity-70"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <div className="text-center">
              <Link href="/login" className="text-sm text-blue-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
```

## Route Protection

Implement route protection to secure your application routes:

```jsx
// src/middleware.js
import { NextResponse } from 'next/server';

// Paths that require authentication
const protectedPaths = [
  '/user/dashboard',
  '/doctor/dashboard',
  '/admin/dashboard',
  '/profile',
  '/settings',
];

// Paths that require specific roles
const roleProtectedPaths = {
  '/admin': ['admin'],
  '/doctor': ['doctor'],
  '/user': ['patient'],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Check for role-specific paths
  const roleProtectedPath = Object.keys(roleProtectedPaths).find(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // If the path is not protected, continue
  if (!isProtectedPath && !roleProtectedPath) {
    return NextResponse.next();
  }
  
  // Get the access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // If no token is found, redirect to login
  if (!accessToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // For role-specific paths, we would need to decode the JWT
  // This is a simplified example - in a real app, you would verify the token
  // and check the user's role
  
  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all protected paths
    ...protectedPaths.map(path => `${path}/:path*`),
    // Match all role-protected paths
    ...Object.keys(roleProtectedPaths).map(path => `${path}/:path*`),
  ],
};
```

For client-side route protection, use the ProtectedRoute component:

```jsx
// Example usage in a page component
"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/auth';

export default function UserDashboard() {
  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <div>
        <h1>User Dashboard</h1>
        {/* Dashboard content */}
      </div>
    </ProtectedRoute>
  );
}
```

## User Role Management

Implement role-based access control in your components:

```jsx
// src/components/layout/Sidebar.jsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
  const { currentUser, hasRole } = useAuth();
  
  if (!currentUser) return null;
  
  return (
    <aside className="w-64 bg-white shadow-md h-screen">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Second Opinion</h2>
        <p className="text-sm text-gray-600">{currentUser.name}</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {/* Common links for all users */}
          <li>
            <Link 
              href="/dashboard" 
              className="block p-2 rounded hover:bg-gray-100"
            >
              Dashboard
            </Link>
          </li>
          
          <li>
            <Link 
              href="/profile" 
              className="block p-2 rounded hover:bg-gray-100"
            >
              Profile
            </Link>
          </li>
          
          {/* Patient-specific links */}
          {hasRole('patient') && (
            <>
              <li>
                <Link 
                  href="/user/medical-records" 
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  Medical Records
                </Link>
              </li>
              <li>
                <Link 
                  href="/user/appointments" 
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  Appointments
                </Link>
              </li>
            </>
          )}
          
          {/* Doctor-specific links */}
          {hasRole('doctor') && (
            <>
              <li>
                <Link 
                  href="/doctor/patients" 
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  Patients
                </Link>
              </li>
              <li>
                <Link 
                  href="/doctor/schedule" 
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  Schedule
                </Link>
              </li>
            </>
          )}
          
          {/* Admin-specific links */}
          {hasRole('admin') && (
            <>
              <li>
                <Link 
                  href="/admin/users" 
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  User Management
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/doctors" 
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  Doctor Management
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/settings" 
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  System Settings
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
```

## Testing Authentication

Create a comprehensive testing plan for your authentication implementation:

### Manual Testing Checklist

1. **Registration Flow**
   - [ ] User can register with valid information
   - [ ] Validation errors display correctly for invalid inputs
   - [ ] Terms and conditions must be accepted
   - [ ] Admin registration is prevented
   - [ ] Verification email is sent
   - [ ] User can verify email with OTP

2. **Login Flow**
   - [ ] User can log in with valid credentials
   - [ ] Error messages display for invalid credentials
   - [ ] Unverified users are prompted to verify email
   - [ ] User is redirected to appropriate dashboard based on role

3. **Password Reset Flow**
   - [ ] User can request password reset
   - [ ] Reset email is sent
   - [ ] User can reset password with valid token
   - [ ] Password validation works correctly

4. **Google OAuth Flow**
   - [ ] User can sign in with Google
   - [ ] New users are created with Google information
   - [ ] Existing users are logged in

5. **Token Management**
   - [ ] Access token is refreshed automatically
   - [ ] User remains logged in across page refreshes
   - [ ] User is logged out when token expires and can't be refreshed

6. **Route Protection**
   - [ ] Unauthenticated users are redirected to login
   - [ ] Users can only access routes for their role
   - [ ] Redirect works correctly after login

### Automated Testing

For automated testing, consider using tools like Cypress or Playwright to create end-to-end tests for your authentication flows:

```javascript
// Example Cypress test for login
describe('Login Flow', () => {
  it('should login successfully with valid credentials', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();
    
    // Check that we're redirected to dashboard
    cy.url().should('include', '/dashboard');
    
    // Check that user is logged in
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });
  
  it('should show error with invalid credentials', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Check that error message is displayed
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
  });
});
```

## Security Best Practices

Implement these security best practices in your authentication system:

1. **Token Storage**
   - Store tokens in HttpOnly cookies when possible
   - For client-side storage, use localStorage with caution
   - Consider using a combination of memory storage and refresh tokens

2. **CSRF Protection**
   - Implement CSRF tokens for sensitive operations
   - Use SameSite cookie attributes

3. **XSS Prevention**
   - Sanitize user inputs
   - Use React's built-in XSS protection
   - Implement Content Security Policy (CSP)

4. **Secure Headers**
   - Set appropriate security headers
   - Use HTTPS for all requests

5. **Rate Limiting**
   - Implement rate limiting for authentication endpoints
   - Add exponential backoff for failed attempts

6. **Logging and Monitoring**
   - Log authentication events
   - Monitor for suspicious activities
   - Implement alerts for unusual login patterns

7. **Session Management**
   - Implement proper session timeouts
   - Allow users to view and terminate active sessions
   - Provide "Remember Me" functionality with secure implementation

8. **Password Policies**
   - Enforce strong password requirements
   - Implement password history to prevent reuse
   - Consider implementing password breach detection

Example implementation for secure token storage:

```jsx
// src/utils/tokenStorage.js
const TOKEN_STORAGE_KEY = 'auth_tokens';

// Store tokens securely
export const storeTokens = (accessToken, refreshToken) => {
  // For production, consider using HttpOnly cookies instead
  try {
    // Store access token in memory for current session
    window.sessionStorage.setItem('accessToken', accessToken);
    
    // Store refresh token in localStorage (encrypted in a real app)
    const tokens = {
      refreshToken,
      expires: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    return true;
  } catch (error) {
    console.error('Error storing tokens:', error);
    return false;
  }
};

// Get access token
export const getAccessToken = () => {
  try {
    return window.sessionStorage.getItem('accessToken');
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

// Get refresh token
export const getRefreshToken = () => {
  try {
    const tokensStr = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!tokensStr) return null;
    
    const tokens = JSON.parse(tokensStr);
    
    // Check if refresh token is expired
    if (tokens.expires < new Date().getTime()) {
      // Clear expired tokens
      clearTokens();
      return null;
    }
    
    return tokens.refreshToken;
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

// Clear all tokens
export const clearTokens = () => {
  try {
    window.sessionStorage.removeItem('accessToken');
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing tokens:', error);
    return false;
  }
};
```

By following this guide, you'll have a comprehensive authentication system for your Second Opinion application that handles user registration, login, password reset, and role-based access control.