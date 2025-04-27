"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasswordInput from '../common/PasswordInput';
import SocialLoginButton from '../common/SocialLoginButton';
import AuthDivider from '../common/AuthDivider';
import { useAuth } from '@/contexts/AuthContext';

const SignupForm = ({ 
  userType = 'user', // 'user' or 'doctor'
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
      
      const result = await register(userData, finalRedirectPath);
      
      if (result.success) {
        // If signup is successful, redirect to success page with redirect path
        router.push(`/signup/success?email=${encodeURIComponent(email)}&type=${userType}&redirect=${encodeURIComponent(finalRedirectPath)}`);
      } else {
        setError(result.error || 'Failed to create account');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleGoogleSignup = async () => {
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
      
      // Determine the redirect path
      const defaultRedirect = userType === 'doctor' ? '/doctor/portal' : '/';
      const finalRedirectPath = redirectPath || defaultRedirect;
      
      // Call the googleAuth method from AuthContext with redirectPath
      const result = await googleAuth(
        response.credential, 
        userType,
        finalRedirectPath
      );
      
      if (result.success) {
        if (result.isNewUser) {
          // If it's a new user, redirect to signup success page
          router.push(`/signup/success?email=${encodeURIComponent(result.user.email)}&type=${userType}&redirect=${encodeURIComponent(finalRedirectPath)}`);
        } else {
          // If existing user, redirect to dashboard
          router.push(finalRedirectPath);
        }
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

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
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
        </div>

        <div className="flex items-center">
          <input
            id="agreeTerms"
            name="agreeTerms"
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="agreeTerms" className="ml-2 block text-xs text-gray-700">
            I agree to the <a href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <AuthDivider text="or" />

      <SocialLoginButton 
        provider="Google" 
        onClick={handleGoogleSignup}
        isLoading={isLoading && !formData.email}
      />

      <div className="text-center">
        <p className="text-xs text-gray-600">
          Already have an account?{' '}
          <Link href={`/login/${userType}`} className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;