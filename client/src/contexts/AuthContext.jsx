"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Create the auth context
const AuthContext = createContext();

// Mock user data
const mockUsers = {
  admin: {
    id: 'admin-123',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff',
    verified: true
  },
  doctor: {
    id: 'doctor-123',
    name: 'Dr. John Smith',
    email: 'doctor@example.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Cardiology',
    avatar: 'https://ui-avatars.com/api/?name=Dr+John+Smith&background=10b981&color=fff',
    verified: true
  },
  user: {
    id: 'user-123',
    name: 'Jane Doe',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=3b82f6&color=fff',
    verified: true
  }
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setAuthToken(storedToken);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password, userType) => {
    setAuthError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just check if the email contains the userType
      // In a real app, you would validate credentials against your backend
      const mockUser = mockUsers[userType];
      
      if (mockUser && (email.includes(userType) || email === mockUser.email) && password === mockUser.password) {
        setCurrentUser(mockUser);
        
        // Generate a mock token
        const token = `mock-token-${Date.now()}`;
        setAuthToken(token);
        
        // Store in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        localStorage.setItem('authToken', token);
        
        // Return success
        return { success: true, user: mockUser };
      }
      
      setAuthError('Invalid credentials');
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('An error occurred during login');
      return { success: false, error: 'An error occurred during login' };
    }
  };

  // Signup function
  const signup = async (userData, userType) => {
    setAuthError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email already exists
      const emailExists = Object.values(mockUsers).some(user => user.email === userData.email);
      
      if (emailExists) {
        const error = 'Email already exists';
        setAuthError(error);
        return { success: false, error };
      }
      
      // In a real app, you would send this data to your backend
      // For mock purposes, we'll just create a new user object
      const newUser = {
        id: `${userType}-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userType,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`,
        verified: false // User needs to verify email
      };
      
      // In a real app, you would send this to your backend
      console.log('New user registered:', newUser);
      
      // Don't log in the user yet - they need to verify email first
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      setAuthError('An error occurred during signup');
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear the current user and token
      setCurrentUser(null);
      setAuthToken(null);
      
      // Remove from localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      
      // Return success
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to logout' };
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email exists in our mock users
      const userExists = Object.values(mockUsers).some(user => user.email === email);
      
      if (!userExists) {
        return { success: false, error: 'Email not found in our records' };
      }
      
      // In a real app, you would send a reset link to the user's email
      console.log(`Password reset link sent to: ${email}`);
      
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Failed to send reset link' };
    }
  };

  // Verify email function
  const verifyEmail = async (token) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would validate the token with your backend
      // For demo purposes, we'll consider tokens longer than 10 chars as valid
      if (token && token.length > 10) {
        console.log(`Email verified with token: ${token}`);
        return { success: true };
      }
      
      return { success: false, error: 'Invalid verification token' };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'An error occurred during verification' };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser && !!authToken;
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