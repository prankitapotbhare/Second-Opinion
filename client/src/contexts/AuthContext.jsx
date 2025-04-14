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
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff'
  },
  doctor: {
    id: 'doctor-123',
    name: 'Dr. John Smith',
    email: 'doctor@example.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Cardiology',
    avatar: 'https://ui-avatars.com/api/?name=Dr+John+Smith&background=10b981&color=fff'
  },
  user: {
    id: 'user-123',
    name: 'Jane Doe',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=3b82f6&color=fff'
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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the mock user that matches the email and password
      const mockUser = mockUsers[userType];
      
      if (mockUser && mockUser.email === email && mockUser.password === password) {
        // Generate a mock token
        const token = `mock-token-${Date.now()}-${userType}`;
        
        // Set the current user and token
        setCurrentUser(mockUser);
        setAuthToken(token);
        
        // Store in localStorage
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        localStorage.setItem('authToken', token);
        
        // Return success
        return { success: true, user: mockUser };
      }
      
      // Return error if login fails
      const error = 'Invalid email or password';
      setAuthError(error);
      return { success: false, error };
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Signup function
  const signup = async (userData, userType) => {
    setAuthError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
        ...userData,
        role: userType,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`
      };
      
      // In a real app, you would store this in your database
      // For mock purposes, we'll just return success
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
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
    setAuthError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email exists
      const emailExists = Object.values(mockUsers).some(user => user.email === email);
      
      if (!emailExists) {
        const error = 'Email not found';
        setAuthError(error);
        return { success: false, error };
      }
      
      // In a real app, you would send a reset password email
      // For mock purposes, we'll just return success
      return { success: true };
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Verify email function
  const verifyEmail = async (token) => {
    setAuthError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would verify the token
      // For mock purposes, we'll just check if the token is valid
      if (token && token.length > 10) {
        return { success: true };
      }
      
      const error = 'Invalid verification token';
      setAuthError(error);
      return { success: false, error };
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
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

  // Get user role
  const getUserRole = () => {
    return currentUser?.role || null;
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
    hasRole,
    getUserRole
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