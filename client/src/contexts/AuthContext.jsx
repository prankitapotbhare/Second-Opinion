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

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password, userType) => {
    // Find the mock user that matches the email and password
    const mockUser = mockUsers[userType];
    
    if (mockUser && mockUser.email === email && mockUser.password === password) {
      // Set the current user
      setCurrentUser(mockUser);
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      // Return success
      return { success: true, user: mockUser };
    }
    
    // Return error if login fails
    return { success: false, error: 'Invalid email or password' };
  };

  // Signup function
  const signup = (userData, userType) => {
    // In a real app, you would send this data to your backend
    // For mock purposes, we'll just create a new user object
    const newUser = {
      id: `${userType}-${Date.now()}`,
      ...userData,
      role: userType,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`
    };
    
    // Set the current user
    setCurrentUser(newUser);
    
    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Return success
    return { success: true, user: newUser };
  };

  // Logout function
  const logout = () => {
    // Clear the current user
    setCurrentUser(null);
    
    // Remove from localStorage
    localStorage.removeItem('currentUser');
    
    // Return success
    return { success: true };
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  // Context value
  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAuthenticated,
    hasRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};