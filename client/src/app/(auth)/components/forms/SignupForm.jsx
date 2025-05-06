"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasswordInput from '../common/PasswordInput';
import SocialLoginButton from '../common/SocialLoginButton';
import AuthDivider from '../common/AuthDivider';
import { useAuth } from '@/contexts/AuthContext';

const SignupForm = ({ 
  userType = "patient", // "patient" or 'doctor'
  redirectPath
}) => {
  const router = useRouter();
  const { register, googleAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  
    const { name, email, password, confirmPassword, agreeTerms } = formData;
  
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
  
    // Validate terms agreement
    if (!agreeTerms) {
      setError('You must agree to the terms and conditions');
      setIsLoading(false);
      return;
    }
  
    try {
      // Determine the redirect path
      const defaultRedirect = userType === 'doctor' ? '/doctor/portal' : '/';
      const finalRedirectPath = redirectPath || defaultRedirect;
      
      // Call the register function from the auth context
      const userData = { 
        name,
        email, 
        password,
        role: userType,
        termsAccepted: agreeTerms
      };
      
      const result = await register(userData);
      
      if (result.success) {
        // Redirect to verification page with email and redirect path
        router.push(`/verify-email?email=${encodeURIComponent(email)}&type=${userType}&redirect=${encodeURIComponent(finalRedirectPath)}`);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
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
      // Determine the redirect path
      const defaultRedirect = userType === 'doctor' ? '/doctor/portal' : '/';
      const finalRedirectPath = redirectPath || defaultRedirect;
      
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
              userType,
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
        // If this is a new user, we might want to collect additional information
        if (result.isNewUser) {
          // For now, just redirect to the dashboard
          router.push(finalRedirectPath);
        } else {
          // Existing user, redirect to dashboard
          router.push(finalRedirectPath);
        }
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

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base"
            placeholder="Enter your full name"
          />
        </div>
        
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
          placeholder="Create a password"
          label="Password"
        />
        
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          label="Confirm Password"
        />
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeTerms" className="font-medium text-gray-700">
              I agree to the <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <AuthDivider text="or continue with" />
      
      <SocialLoginButton 
        provider="google"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      />
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href={`/login/${userType}`} className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;