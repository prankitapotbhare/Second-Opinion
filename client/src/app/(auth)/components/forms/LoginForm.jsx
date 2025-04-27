"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasswordInput from '../common/PasswordInput';
import SocialLoginButton from '../common/SocialLoginButton';
import AuthDivider from '../common/AuthDivider';
import { useAuth } from '@/contexts/AuthContext';
import OtpVerificationForm from './OtpVerificationForm';

const LoginForm = ({ 
  userType = 'user', // 'user', 'doctor', or 'admin'
  hideOptions = false,
  redirectPath
}) => {
  const router = useRouter();
  const { login, resendVerification, googleAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Get redirect path from props or URL params
  const getRedirectPath = () => {
    // First check if redirectPath prop is provided
    if (redirectPath) return redirectPath;
    
    // Default paths based on user type
    return userType === 'doctor' ? '/doctor/dashboard' : 
           userType === 'admin' ? '/admin/dashboard' : '/';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const { email, password, rememberMe } = formData;
    
    try {
      // Map userType to expected role for backend
      let expectedRole;
      if (userType === 'user') {
        expectedRole = 'patient';
      } else if (userType === 'doctor' || userType === 'admin') {
        expectedRole = userType;
      }
      
      // Determine the redirect path
      const finalRedirectPath = redirectPath || (userType === 'admin' ? '/admin/dashboard' : 
                                                userType === 'doctor' ? '/doctor/dashboard' : '/');
      
      const result = await login(email, password, rememberMe, expectedRole);
      
      if (result.success) {
        // Redirect to the appropriate dashboard
        router.push(finalRedirectPath);
      } else {
        // Check if email needs verification
        if (result.needsVerification) {
          setNeedsVerification(true);
          setVerificationEmail(email);
        } else if (result.wrongRole) {
          // Handle wrong role (e.g., trying to log in as doctor with a patient account)
          setError(result.error);
        } else {
          setError(result.error || 'Login failed. Please check your credentials.');
        }
        setIsLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
      console.error(err);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      // Map userType to expected role for backend
      const backendUserType = userType === 'user' ? 'patient' : userType;
      
      // Determine the redirect path
      const finalRedirectPath = redirectPath || (userType === 'admin' ? '/admin/dashboard' : 
                                                userType === 'doctor' ? '/doctor/dashboard' : '/');
      
      // Initialize Google Sign-In
      if (!window.google) {
        setError('Google authentication is not available');
        setIsLoading(false);
        return;
      }
      
      // Get Google Identity Services
      const googleIdentity = window.google.accounts.id;
      
      // Promise to handle the callback
      const googleAuthPromise = new Promise((resolve, reject) => {
        const handleCredentialResponse = async (response) => {
          try {
            // Call the googleAuth function with the ID token
            const result = await googleAuth(
              response.credential,
              backendUserType,
              finalRedirectPath
            );
            
            resolve(result);
          } catch (error) {
            reject(error);
          }
        };
        
        // Configure Google Sign-In
        googleIdentity.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false
        });
        
        // Prompt the user
        googleIdentity.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            reject(new Error('Google sign-in prompt was not displayed or was skipped'));
          }
        });
      });
      
      // Wait for the Google authentication to complete
      const result = await googleAuthPromise;
      
      if (result.success) {
        // Redirect to the appropriate dashboard
        router.push(finalRedirectPath);
      } else {
        setError(result.error || 'Google authentication failed');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred during Google authentication');
      setIsLoading(false);
      console.error(err);
    }
  };

  // Handle verification success
  const handleVerificationSuccess = (result) => {
    // Determine the redirect path
    const finalRedirectPath = redirectPath || (userType === 'admin' ? '/admin/dashboard' : 
                                              userType === 'doctor' ? '/doctor/dashboard' : '/');
    
    // Redirect to the appropriate dashboard
    router.push(finalRedirectPath);
  };

  // If email needs verification, show the OTP verification form
  if (needsVerification) {
    return (
      <OtpVerificationForm 
        email={verificationEmail}
        redirectPath={redirectPath || (userType === 'admin' ? '/admin/dashboard' : 
                                      userType === 'doctor' ? '/doctor/dashboard' : '/')}
        onSuccess={handleVerificationSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md text-sm">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base"
            placeholder="Enter your email"
          />
        </div>
        
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </Link>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      
      {!hideOptions && (
        <>
          <AuthDivider text="or continue with" />
          
          <SocialLoginButton 
            provider="google"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          />
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href={`/signup/${userType}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginForm;