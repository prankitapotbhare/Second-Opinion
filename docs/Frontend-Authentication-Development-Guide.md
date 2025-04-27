# Frontend Authentication Development Guide

This guide will help you implement authentication in your frontend application using the existing backend API and context structure.

## 1. API Integration

Create or update your authentication API service file to interact with your backend:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\api\auth.api.js
/**
 * Authentication API service
 * Handles all authentication-related API calls to the backend
 */

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

// Register a new user
export const register = async (userData) => {
  // Implementation exists
};

// Login user
export const login = async (email, password, expectedRole = null) => {
  // Implementation exists
};

// Logout user
export const logout = async (refreshToken) => {
  // Implementation exists
};

// Refresh access token
export const refreshToken = async (refreshToken) => {
  // Implementation exists
};

// Request password reset
export const requestPasswordReset = async (email) => {
  // Implementation exists
};

// Reset password with token
export const resetPassword = async (token, password) => {
  // Implementation exists
};

// Verify email
export const verifyEmail = async (token) => {
  // Implementation exists
};

// Resend verification email
export const resendVerification = async (email, redirectPath = '/dashboard') => {
  // Implementation exists
};

// Get current user profile
export const getCurrentUser = async (token) => {
  // Implementation exists
};

// Google authentication
export const googleAuth = async (idToken, userType = 'user', redirectPath = '/dashboard') => {
  // Implementation exists
};

// NEW: Admin-specific functions
export const getAllPatients = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/patients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Get all patients error:', error);
    throw error;
  }
};

export const getAllDoctors = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/doctors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Get all doctors error:', error);
    throw error;
  }
};

export const createAdmin = async (adminData, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adminData)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Create admin error:', error);
    throw error;
  }
};

export const updateAdminProfile = async (adminId, adminData, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/${adminId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adminData)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Update admin error:', error);
    throw error;
  }
};
```

## 2. Authentication Context

Enhance your existing AuthContext to include admin-specific functionality:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\contexts\AuthContext.jsx
// Add these functions to your existing AuthContext

// Inside the AuthProvider component:

// Admin functions
const getAllPatients = async () => {
  setLoading(true);
  
  try {
    if (!authToken) {
      throw new Error('Authentication required');
    }
    
    const response = await authApi.getAllPatients(authToken);
    
    setLoading(false);
    
    if (response.success) {
      return { success: true, patients: response.data };
    }
    
    return { success: false, error: response.message };
  } catch (error) {
    console.error('Get all patients error:', error);
    setLoading(false);
    return { success: false, error: error.message };
  }
};

const getAllDoctors = async () => {
  setLoading(true);
  
  try {
    if (!authToken) {
      throw new Error('Authentication required');
    }
    
    const response = await authApi.getAllDoctors(authToken);
    
    setLoading(false);
    
    if (response.success) {
      return { success: true, doctors: response.data };
    }
    
    return { success: false, error: response.message };
  } catch (error) {
    console.error('Get all doctors error:', error);
    setLoading(false);
    return { success: false, error: error.message };
  }
};

const createAdmin = async (adminData) => {
  setLoading(true);
  
  try {
    if (!authToken) {
      throw new Error('Authentication required');
    }
    
    // Verify current user is a superadmin
    if (currentUser?.role !== 'admin') {
      throw new Error('Only super admins can create new admins');
    }
    
    const response = await authApi.createAdmin(adminData, authToken);
    
    setLoading(false);
    
    if (response.success) {
      return { success: true, admin: response.data };
    }
    
    return { success: false, error: response.message };
  } catch (error) {
    console.error('Create admin error:', error);
    setLoading(false);
    return { success: false, error: error.message };
  }
};

const updateAdminProfile = async (adminId, adminData) => {
  setLoading(true);
  
  try {
    if (!authToken) {
      throw new Error('Authentication required');
    }
    
    const response = await authApi.updateAdminProfile(adminId, adminData, authToken);
    
    setLoading(false);
    
    if (response.success) {
      // If updating current user, update context
      if (adminId === currentUser?.uid) {
        const updatedUser = {
          ...currentUser,
          ...formatUserData(response.data)
        };
        setCurrentUser(updatedUser);
        
        // Update storage
        const storage = localStorage.getItem('rememberMe') === 'true' ? localStorage : sessionStorage;
        storage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      return { success: true, admin: response.data };
    }
    
    return { success: false, error: response.message };
  } catch (error) {
    console.error('Update admin error:', error);
    setLoading(false);
    return { success: false, error: error.message };
  }
};

// Add these functions to the context value
const value = {
  // Existing values...
  getAllPatients,
  getAllDoctors,
  createAdmin,
  updateAdminProfile
};
```

## 3. Role-Based Route Protection

Create a higher-order component to protect routes based on user roles:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\components\auth\ProtectedRoute.jsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthLoading from './AuthLoading';

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['patient', 'doctor', 'admin'],
  redirectPath = '/login'
}) {
  const { currentUser, loading, authToken } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait for auth context to initialize
    if (!loading) {
      if (!currentUser || !authToken) {
        // User not logged in, redirect to login
        router.push(redirectPath);
      } else if (!allowedRoles.includes(currentUser.role)) {
        // User doesn't have required role, redirect to dashboard or home
        router.push('/dashboard');
      } else {
        // User is authenticated and has required role
        setChecking(false);
      }
    }
  }, [currentUser, loading, router, allowedRoles, redirectPath, authToken]);

  if (loading || checking) {
    return <AuthLoading message="Checking authorization..." />;
  }

  return children;
}
```

## 4. Admin Dashboard Components

Create admin-specific components:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\app\admin\components\UserManagement.jsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserManagement() {
  const { getAllPatients, getAllDoctors, authToken } = useAuth();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch patients and doctors in parallel
        const [patientsResult, doctorsResult] = await Promise.all([
          getAllPatients(),
          getAllDoctors()
        ]);
        
        if (patientsResult.success) {
          setPatients(patientsResult.patients);
        }
        
        if (doctorsResult.success) {
          setDoctors(doctorsResult.doctors);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again.');
        setLoading(false);
      }
    };
    
    if (authToken) {
      fetchUsers();
    }
  }, [authToken]);

  if (loading) {
    return <div className="text-center p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      {/* Patients Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Patients ({patients.length})</h3>
        {patients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Verified</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{patient.name}</td>
                    <td className="py-2 px-4 border-b">{patient.email}</td>
                    <td className="py-2 px-4 border-b">
                      {patient.isEmailVerified ? 
                        <span className="text-green-500">Yes</span> : 
                        <span className="text-red-500">No</span>}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button className="text-blue-500 hover:underline mr-2">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No patients found.</p>
        )}
      </div>
      
      {/* Doctors Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Doctors ({doctors.length})</h3>
        {doctors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Verified</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doctor => (
                  <tr key={doctor._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{doctor.name}</td>
                    <td className="py-2 px-4 border-b">{doctor.email}</td>
                    <td className="py-2 px-4 border-b">
                      {doctor.isEmailVerified ? 
                        <span className="text-green-500">Yes</span> : 
                        <span className="text-red-500">No</span>}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button className="text-blue-500 hover:underline mr-2">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No doctors found.</p>
        )}
      </div>
    </div>
  );
}
```

## 5. Admin Profile Management

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\app\admin\components\AdminProfile.jsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminProfile() {
  const { currentUser, updateAdminProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateAdminProfile(currentUser.uid, {
        name: formData.name,
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
            disabled
          />
          <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
```

## 6. Create Admin Form (Super Admin Only)

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\app\admin\components\CreateAdminForm.jsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PasswordInput } from '@/app/(auth)/components';

export default function CreateAdminForm() {
  const { currentUser, createAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Check if current user is a super admin
  const isSuperAdmin = currentUser?.role === 'admin';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await createAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin'
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Admin created successfully' });
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create admin' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="text-center p-4 text-red-500">
        Only super admins can create new admin accounts.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-6">Create New Admin</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Confirm Password</label>
          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Admin'}
        </button>
      </form>
    </div>
  );
}
```

## 7. Admin Dashboard Page

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\app\admin\dashboard\page.jsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserManagement from '../components/UserManagement';
import AdminProfile from '../components/AdminProfile';
import CreateAdminForm from '../components/CreateAdminForm';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  return (
    <ProtectedRoute allowedRoles={['admin']} redirectPath="/login/admin">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {currentUser?.displayName}</p>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Admin Profile
              </button>
              <button
                onClick={() => setActiveTab('create-admin')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create-admin'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Create Admin
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'profile' && <AdminProfile />}
            {activeTab === 'create-admin' && <CreateAdminForm />}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
```

## 8. Admin Login Page

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\app\login\admin\page.jsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SplitScreen, AuthHeader, LoginForm } from '@/app/(auth)/components';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password, rememberMe) => {
    setError('');
    setLoading(true);
    
    try {
      const result = await login(email, password, rememberMe, 'admin');
      
      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        if (result.wrongRole) {
          setError(`This account is not registered as an admin. Please use the regular login page.`);
        } else {
          setError(result.error || 'Failed to login');
        }
      }
    } catch (error) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SplitScreen
      leftContent={
        <div className="flex flex-col justify-center h-full p-8">
          <AuthHeader
            title="Admin Login"
            subtitle="Sign in to access the admin dashboard"
            align="left"
          />
          
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
            hideGoogleLogin={true}
            buttonText="Sign in as Admin"
          />
        </div>
      }
      rightContent={
        <div className="flex items-center justify-center h-full bg-blue-600 p-8">
          <div className="text-white max-w-md">
            <h2 className="text-3xl font-bold mb-4">Admin Portal</h2>
            <p className="text-xl">
              Manage users, view system statistics, and administer the Second Opinion platform.
            </p>
          </div>
        </div>
      }
    />
  );
}
```

## 9. Testing Authentication

Create a test utility to help with authentication testing:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\utils\auth-test.util.js
/**
 * Utility functions for testing authentication
 */

// Test if tokens are valid
export const testTokens = async (accessToken, refreshToken) => {
  try {
    // Test access token with a protected endpoint
    const meResponse = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (meResponse.ok) {
      console.log('✅ Access token is valid');
    } else {
      console.log('❌ Access token is invalid or expired');
      
      // Try refreshing the token
      const refreshResponse = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });
      
      if (refreshResponse.ok) {
        console.log('✅ Refresh token is valid and new tokens were generated');
        const data = await refreshResponse.json();
        return {
          valid: true,
          newAccessToken: data.data.tokens.accessToken,
          newRefreshToken: data.data.tokens.refreshToken
        };
      } else {
        console.log('❌ Refresh token is invalid or expired');
        return { valid: false };
      }
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Error testing tokens:', error);
    return { valid: false, error: error.message };
  }
};

// Test login with different roles
export const testLogin = async (email, password, role = null) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, role })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Login successful as ${data.data.user.role}`);
      return {
        success: true,
        user: data.data.user,
        tokens: data.data.tokens
      };
    } else {
      console.log(`❌ Login failed: ${data.message}`);
      return {
        success: false,
        message: data.message
      };
    }
  } catch (error) {
    console.error('Error testing login:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during login test'
    };
  }
};

// Test registration
export const testRegistration = async (userData) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Registration successful for ${userData.email}`);
      return {
        success: true,
        userId: data.data.userId,
        email: data.data.email
      };
    } else {
      console.log(`❌ Registration failed: ${data.message}`);
      return {
        success: false,
        message: data.message
      };
    }
  } catch (error) {
    console.error('Error testing registration:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during registration test'
    };
  }
};

// Test email verification
export const testEmailVerification = async (email, otp) => {
  try {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Email verification successful for ${email}`);
      return {
        success: true,
        user: data.data.user,
        tokens: data.data.tokens
      };
    } else {
      console.log(`❌ Email verification failed: ${data.message}`);
      return {
        success: false,
        message: data.message
      };
    }
  } catch (error) {
    console.error('Error testing email verification:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during email verification test'
    };
  }
};

// Test password reset request
export const testPasswordResetRequest = async (email) => {
  try {
    const response = await fetch('/api/auth/request-password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Password reset request successful for ${email}`);
      return {
        success: true
      };
    } else {
      console.log(`❌ Password reset request failed: ${data.message}`);
      return {
        success: false,
        message: data.message
      };
    }
  } catch (error) {
    console.error('Error testing password reset request:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during password reset request test'
    };
  }
};

// Test password reset
export const testPasswordReset = async (token, password) => {
  try {
    const response = await fetch(`/api/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Password reset successful');
      return {
        success: true
      };
    } else {
      console.log(`❌ Password reset failed: ${data.message}`);
      return {
        success: false,
        message: data.message
      };
    }
  } catch (error) {
    console.error('Error testing password reset:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during password reset test'
    };
  }
};

// Test logout
export const testLogout = async (refreshToken) => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Logout successful');
      return {
        success: true
      };
    } else {
      console.log(`❌ Logout failed: ${data.message}`);
      return {
        success: false,
        message: data.message
      };
    }
  } catch (error) {
    console.error('Error testing logout:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during logout test'
    };
  }
};

// Test Google authentication
export const testGoogleAuth = async (idToken, userType = 'patient') => {
  try {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken, userType })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Google authentication successful as ${data.data.user.role}`);
      return {
        success: true,
        user: data.data.user,
        tokens: data.data.tokens
      };
    } else {
      console.log(`❌ Google authentication failed: ${data.message}`);
      return {
        success: false,
        message: data.message
      };
    }
  } catch (error) {
    console.error('Error testing Google authentication:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during Google authentication test'
    };
  }
};

// Run a complete authentication flow test
export const runAuthFlowTest = async (userData) => {
  console.log('🔍 Starting complete authentication flow test...');
  
  // Step 1: Register
  console.log('Step 1: Testing registration...');
  const registerResult = await testRegistration(userData);
  if (!registerResult.success) {
    console.log('❌ Authentication flow test failed at registration step');
    return registerResult;
  }
  
  // Step 2: Email verification (would need OTP from database or logs in real scenario)
  console.log('Step 2: Email verification would be tested here (requires OTP)');
  
  // Step 3: Login
  console.log('Step 3: Testing login...');
  const loginResult = await testLogin(userData.email, userData.password);
  if (!loginResult.success) {
    console.log('❌ Authentication flow test failed at login step');
    return loginResult;
  }
  
  // Step 4: Test tokens
  console.log('Step 4: Testing tokens...');
  const { accessToken, refreshToken } = loginResult.tokens;
  const tokenResult = await testTokens(accessToken, refreshToken);
  if (!tokenResult.valid) {
    console.log('❌ Authentication flow test failed at token validation step');
    return { success: false, message: 'Token validation failed' };
  }
  
  // Step 5: Logout
  console.log('Step 5: Testing logout...');
  const logoutResult = await testLogout(refreshToken);
  if (!logoutResult.success) {
    console.log('❌ Authentication flow test failed at logout step');
    return logoutResult;
  }
  
  console.log('✅ Complete authentication flow test passed successfully');
  return { success: true };
};
```

## 10. Google OAuth Integration

To complete the Google OAuth integration, you'll need to create a component for handling the Google login:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\app\(auth)\components\common\GoogleLoginButton.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SocialLoginButton } from '@/app/(auth)/components';

const GoogleLoginButton = ({ 
  userType = 'patient', 
  onSuccess, 
  onError,
  buttonText = "Continue with Google",
  className = ""
}) => {
  const { googleLogin } = useAuth();
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Google API script
    const loadGoogleScript = () => {
      if (typeof window !== 'undefined' && !window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setGoogleLoaded(true);
        };
        document.body.appendChild(script);
      } else if (typeof window !== 'undefined' && window.google) {
        setGoogleLoaded(true);
      }
    };

    loadGoogleScript();
  }, []);

  useEffect(() => {
    if (googleLoaded && typeof window !== 'undefined') {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        console.error('Google Client ID is not defined in environment variables');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  }, [googleLoaded]);

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      const result = await googleLogin(response.credential, userType);
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result.user);
        }
      } else {
        if (onError) {
          onError(result.error || 'Google login failed');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (onError) {
        onError(error.message || 'An error occurred during Google login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    if (googleLoaded && typeof window !== 'undefined') {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <SocialLoginButton
      provider="google"
      onClick={handleGoogleClick}
      disabled={!googleLoaded || loading}
      loading={loading}
      className={className}
    >
      {buttonText}
    </SocialLoginButton>
  );
};

export default GoogleLoginButton;
```

Then add the Google login function to your AuthContext:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\contexts\AuthContext.jsx
// Add this function to your AuthContext

// Inside the AuthProvider component:

// Google login
const googleLogin = async (idToken, userType = 'patient') => {
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
      
      // Store in localStorage by default for social logins
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('rememberMe', 'true');
      
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
    console.error('Google login error:', error);
    setLoading(false);
    return { 
      success: false, 
      error: error.message || 'An error occurred during Google login' 
    };
  }
};

// Add googleLogin to the context value
const value = {
  // Existing values...
  googleLogin,
};
```

## 11. Token Management and Auto-Refresh

Enhance your token management to handle token expiration and auto-refresh:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\utils\token.util.js
/**
 * Token utility functions
 */

// Decode JWT token
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    
    // Get current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Calculate time until token expiration in milliseconds
export const getTimeUntilExpiration = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded) return 0;
    
    // Get current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Calculate time until expiration
    const timeUntilExp = decoded.exp - currentTime;
    
    // Convert to milliseconds
    return Math.max(0, timeUntilExp * 1000);
  } catch (error) {
    console.error('Error calculating token expiration time:', error);
    return 0;
  }
};

// Calculate refresh time (5 minutes before expiration)
export const getRefreshTime = (token) => {
  const expTime = getTimeUntilExpiration(token);
  // Refresh 5 minutes before expiration or halfway through if less than 10 minutes
  return Math.max(0, expTime - Math.min(5 * 60 * 1000, expTime / 2));
};
```

## 12. API Request Interceptor

Create an API request interceptor to automatically handle token refresh:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\utils\api.util.js
/**
 * API utility functions with token refresh interceptor
 */

import * as authApi from '@/api/auth.api';
import * as tokenUtil from '@/utils/token.util';

// Store for refresh token promise to prevent multiple refresh requests
let refreshPromise = null;

/**
 * Make an authenticated API request with automatic token refresh
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {string} accessToken - Current access token
 * @param {string} refreshToken - Current refresh token
 * @param {Function} onTokenRefresh - Callback when tokens are refreshed
 * @returns {Promise<Object>} API response
 */
export const fetchWithTokenRefresh = async (
  url,
  options = {},
  accessToken,
  refreshToken,
  onTokenRefresh
) => {
  // Clone options to avoid modifying the original
  const fetchOptions = { ...options };
  
  // Add authorization header if token is provided
  if (accessToken) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Authorization': `Bearer ${accessToken}`
    };
  }
  
  try {
    // Make the initial request
    const response = await fetch(url, fetchOptions);
    
    // If response is 401 Unauthorized and we have a refresh token, try to refresh
    if (response.status === 401 && refreshToken) {
      const responseData = await response.json();
      
      // Check if token is expired
      if (responseData.tokenExpired) {
        // Use existing refresh promise if one is in progress
        if (!refreshPromise) {
          refreshPromise = authApi.refreshToken(refreshToken)
            .then(result => {
              if (result.success) {
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data.tokens;
                
                // Call the callback with new tokens
                if (onTokenRefresh) {
                  onTokenRefresh(newAccessToken, newRefreshToken);
                }
                
                return { accessToken: newAccessToken, refreshToken: newRefreshToken };
              } else {
                throw new Error('Failed to refresh token');
              }
            })
            .finally(() => {
              // Clear the promise when done
              refreshPromise = null;
            });
        }
        
        try {
          // Wait for the refresh to complete
          const { accessToken: newAccessToken } = await refreshPromise;
          
          // Retry the original request with the new token
          const newOptions = {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              'Authorization': `Bearer ${newAccessToken}`
            }
          };
          
          return fetch(url, newOptions);
        } catch (refreshError) {
          // If refresh fails, throw an error
          throw new Error('Session expired. Please log in again.');
        }
      }
      
      // If not a token expiration issue, return the original response
      return response;
    }
    
    // If not a 401 or no refresh token, return the original response
    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Handle API response
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} Parsed response data
 */
export const handleApiResponse = async (response) => {
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
```

## 13. Protected API Service

Create a base API service for protected endpoints:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\api\base.api.js
/**
 * Base API service for protected endpoints
 */

import { fetchWithTokenRefresh, handleApiResponse } from '@/utils/api.util';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Create a protected API service
 * @param {string} accessToken - Current access token
 * @param {string} refreshToken - Current refresh token
 * @param {Function} onTokenRefresh - Callback when tokens are refreshed
 * @returns {Object} API methods
 */
export const createProtectedApiService = (accessToken, refreshToken, onTokenRefresh) => {
  /**
   * Make a GET request to a protected endpoint
   * @param {string} endpoint - API endpoint path
   * @returns {Promise<Object>} API response
   */
  const get = async (endpoint) => {
    try {
      const response = await fetchWithTokenRefresh(
        `${API_URL}${endpoint}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        accessToken,
        refreshToken,
        onTokenRefresh
      );
      
      return handleApiResponse(response);
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      throw error;
    }
  };
  
  /**
   * Make a POST request to a protected endpoint
   * @param {string} endpoint - API endpoint path
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} API response
   */
  const post = async (endpoint, data) => {
    try {
      const response = await fetchWithTokenRefresh(
        `${API_URL}${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        },
        accessToken,
        refreshToken,
        onTokenRefresh
      );
      
      return handleApiResponse(response);
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw error;
    }
  };
  
  /**
   * Make a PUT request to a protected endpoint
   * @param {string} endpoint - API endpoint path
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} API response
   */
  const put = async (endpoint, data) => {
    try {
      const response = await fetchWithTokenRefresh(
        `${API_URL}${endpoint}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        },
        accessToken,
        refreshToken,
        onTokenRefresh
      );
      
      return handleApiResponse(response);
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      throw error;
    }
  };
  
  /**
   * Make a DELETE request to a protected endpoint
   * @param {string} endpoint - API endpoint path
   * @returns {Promise<Object>} API response
   */
  const del = async (endpoint) => {
    try {
      const response = await fetchWithTokenRefresh(
        `${API_URL}${endpoint}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        accessToken,
        refreshToken,
        onTokenRefresh
      );
      
      return handleApiResponse(response);
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      throw error;
    }
  };
  
  return {
    get,
    post,
    put,
    delete: del
  };
};
```

## 14. Integrating Protected API Service with AuthContext

Update your AuthContext to use the protected API service:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\contexts\AuthContext.jsx
// Add these imports at the top
import { createProtectedApiService } from '@/api/base.api';
import * as tokenUtil from '@/utils/token.util';

// Inside the AuthProvider component:

// Create protected API service
const [api, setApi] = useState(null);

// Update API service when tokens change
useEffect(() => {
  if (authToken && refreshToken) {
    const apiService = createProtectedApiService(
      authToken,
      refreshToken,
      (newAccessToken, newRefreshToken) => {
        // Update tokens when refreshed
        setAuthToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        
        // Update storage
        const storage = localStorage.getItem('rememberMe') === 'true' ? localStorage : sessionStorage;
        storage.setItem('authToken', newAccessToken);
        storage.setItem('refreshToken', newRefreshToken);
      }
    );
    
    setApi(apiService);
    
    // Set up token refresh timer
    const refreshTime = tokenUtil.getRefreshTime(authToken);
    const timer = setTimeout(() => {
      refreshUserToken(refreshToken);
    }, refreshTime);
    
    setTokenRefreshTimer(timer);
    
    return () => {
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }
    };
  } else {
    setApi(null);
  }
}, [authToken, refreshToken]);

// Add api to the context value
const value = {
  // Existing values...
  api,
};
```

## 15. Session Persistence and Security

Enhance session persistence and security:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\utils\session.util.js
/**
 * Session utility functions
 */

// Session storage keys
const KEYS = {
  USER: 'currentUser',
  ACCESS_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  REMEMBER_ME: 'rememberMe'
};

/**
 * Save session data
 * @param {Object} data - Session data
 * @param {Object} data.user - User data
 * @param {string} data.accessToken - Access token
 * @param {string} data.refreshToken - Refresh token
 * @param {boolean} rememberMe - Whether to remember the session
 */
export const saveSession = (data, rememberMe = false) => {
  const { user, accessToken, refreshToken } = data;
  const storage = rememberMe ? localStorage : sessionStorage;
  
  if (user) {
    storage.setItem(KEYS.USER, JSON.stringify(user));
  }
  
  if (accessToken) {
    storage.setItem(KEYS.ACCESS_TOKEN, accessToken);
  }
  
  if (refreshToken) {
    storage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
  }
  
  if (rememberMe) {
    localStorage.setItem(KEYS.REMEMBER_ME, 'true');
  } else {
    localStorage.removeItem(KEYS.REMEMBER_ME);
  }
};

/**
 * Load session data
 * @returns {Object|null} Session data or null if no session
 */
export const loadSession = () => {
  const rememberMe = localStorage.getItem(KEYS.REMEMBER_ME) === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;
  
  const userStr = storage.getItem(KEYS.USER) || localStorage.getItem(KEYS.USER) || sessionStorage.getItem(KEYS.USER);
  const accessToken = storage.getItem(KEYS.ACCESS_TOKEN) || localStorage.getItem(KEYS.ACCESS_TOKEN) || sessionStorage.getItem(KEYS.ACCESS_TOKEN);
  const refreshToken = storage.getItem(KEYS.REFRESH_TOKEN) || localStorage.getItem(KEYS.REFRESH_TOKEN) || sessionStorage.getItem(KEYS.REFRESH_TOKEN);
  
  if (!userStr || !accessToken || !refreshToken) {
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    
    return {
      user,
      accessToken,
      refreshToken,
      rememberMe
    };
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Clear session data
 */
export const clearSession = () => {
  // Clear both storages to be safe
  localStorage.removeItem(KEYS.USER);
  localStorage.removeItem(KEYS.ACCESS_TOKEN);
  localStorage.removeItem(KEYS.REFRESH_TOKEN);
  localStorage.removeItem(KEYS.REMEMBER_ME);
  
  sessionStorage.removeItem(KEYS.USER);
  sessionStorage.removeItem(KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(KEYS.REFRESH_TOKEN);
};
```

## 16. Implementing Auth Guards for Routes

Create a middleware-like function to protect routes in Next.js:

```javascript:c:\Users\prank\Project\Second-Opinion\client\src\middleware.js
import { NextResponse } from 'next/server';

// Define public paths that don't require authentication
const publicPaths = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/terms',
  '/privacy'
];

// Define role-specific paths
const rolePaths = {
  patient: ['/dashboard', '/appointments', '/medical-records'],
  doctor: ['/doctor', '/doctor/dashboard', '/doctor/appointments'],
  admin: ['/admin', '/admin/dashboard']
};

// Check if a path is public
const isPublicPath = (path) => {
  return publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  );
};

// Check if a path is allowed for a role
const isPathAllowedForRole = (path, role) => {
  if (!role) return false;
  
  // Allow users to access their role-specific paths
  const allowedPaths = rolePaths[role] || [];
  return allowedPaths.some(allowedPath => 
    path === allowedPath || path.startsWith(`${allowedPath}/`)
  );
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // Check for auth token in cookies
  const authToken = request.cookies.get('authToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  
  // If no token, redirect to login
  if (!authToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Check if user has access to the requested path
  if (!isPathAllowedForRole(pathname, userRole)) {
    // Redirect to appropriate dashboard based on role
    let redirectPath = '/dashboard'; // Default for patients
    
    if (userRole === 'doctor') {
      redirectPath = '/doctor/dashboard';
    } else if (userRole === 'admin') {
      redirectPath = '/admin/dashboard';
    }
    
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|api).*)'
  ]
};
```

## 17. Conclusion and Next Steps

This guide has provided the foundation for implementing authentication in your frontend application. Here's a summary of what we've covered:

1. **API Integration**: Created API services to interact with your backend authentication endpoints
2. **Authentication Context**: Enhanced the AuthContext to manage user authentication state
3. **Role-Based Route Protection**: Implemented components and middleware to protect routes based on user roles
4. **Admin Dashboard**: Created admin-specific components and pages
5. **Google OAuth Integration**: Added support for Google authentication
6. **Token Management**: Implemented token refresh and expiration handling
7. **Session Persistence**: Added utilities for managing session data

### Next Steps:

1. **Implement Email Verification Flow**: Create pages for email verification and OTP entry
2. **Add Password Reset Flow**: Create pages for requesting password resets and setting new passwords
3. **Enhance Error Handling**: Improve error messages and user feedback
4. **Add Loading States**: Implement loading indicators for authentication operations
5. **Implement Remember Me Functionality**: Allow users to stay logged in across sessions
6. **Add Logout Confirmation**: Prompt users before logging out
7. **Implement Account Switching**: Allow users to switch between different roles if they have multiple accounts
8. **Add Session Timeout Warnings**: Notify users before their session expires
9. **Implement Security Features**: Add rate limiting, CSRF protection, and other security measures

By following this guide, you should have a solid foundation for implementing authentication in your frontend application that integrates with your existing backend API.