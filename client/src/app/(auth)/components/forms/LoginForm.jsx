"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasswordInput from '../common/PasswordInput';
import SocialLoginButton from '../common/SocialLoginButton';
import AuthDivider from '../common/AuthDivider';
import { useAuth } from '@/contexts/AuthContext';

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
    setNeedsVerification(false);
  
    const { email, password, rememberMe } = formData;
    
    try {
      // Pass the rememberMe value to the login function
      const result = await login(email, password, rememberMe);
      
      if (result.success) {
        const finalRedirectPath = getRedirectPath();
        
        // Redirect to success page with appropriate parameters
        router.push(`/login/success?type=${userType}${finalRedirectPath !== '/' ? `&redirect=${encodeURIComponent(finalRedirectPath)}` : ''}`);
      } else if (result.needsVerification) {
        setNeedsVerification(true);
        setVerificationEmail(email);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      // Check if the error contains verification information
      if (err.response && err.response.data && err.response.data.needsVerification) {
        setNeedsVerification(true);
        setVerificationEmail(email);
      } else {
        setError('An unexpected error occurred');
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Load the Google Identity Services script
      const googleScript = document.createElement('script');
      googleScript.src = 'https://accounts.google.com/gsi/client';
      googleScript.async = true;
      googleScript.defer = true;
      document.head.appendChild(googleScript);
      
      googleScript.onload = () => {
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          cancel_on_tap_outside: true
        });
        
        // Prompt the user to select an account
        window.google.accounts.id.prompt();
      };
    } catch (err) {
      setError('Failed to initialize Google authentication');
      console.error(err);
      setIsLoading(false);
    }
  };
  
  // Handle the credential response from Google
  const handleGoogleCredentialResponse = async (response) => {
    try {
      if (!response || !response.credential) {
        throw new Error('Google authentication failed');
      }
      
      // Call the googleAuth method from AuthContext
      const result = await googleAuth(
        response.credential, 
        userType,
        formData.rememberMe
      );
      
      if (result.success) {
        const finalRedirectPath = getRedirectPath();
        router.push(`/login/success?type=${userType}${finalRedirectPath !== '/' ? `&redirect=${encodeURIComponent(finalRedirectPath)}` : ''}`);
      } else {
        setError(result.error || 'Google authentication failed');
      }
    } catch (err) {
      setError('An error occurred during Google authentication');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      // Use the resendVerification function from the auth context
      const result = await resendVerification(verificationEmail);
      
      if (result.success) {
        setError('');
        alert('Verification email has been resent. Please check your inbox.');
      } else {
        setError(result.error || 'Failed to resend verification email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (needsVerification) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Email verification required</h3>
              <div className="mt-2 text-sm">
                <p>Please verify your email address before logging in.</p>
                <button 
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-700 disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Resend verification email'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            setNeedsVerification(false);
            setError('');
          }}
          className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2">
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Email field */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password field */}
          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Remember me / Forgot password */}
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
            <label htmlFor="rememberMe" className="ml-2 block text-xs text-gray-700">
              Remember me
            </label>
          </div>

          {!hideOptions && (
            <div className="text-xs">
              <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </div>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Only show these options if hideOptions is false */}
      {!hideOptions && (
        <>
          <AuthDivider text="or" />
          
          <SocialLoginButton 
            provider="Google" 
            onClick={handleGoogleLogin}
            isLoading={isLoading && !formData.email && !formData.password}
            disabled={userType === 'admin'} // Disable for admin users
          />
          
          <div className="text-center">
            <p className="text-xs text-gray-600">
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