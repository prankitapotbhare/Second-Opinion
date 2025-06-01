"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasswordInput from '../common/PasswordInput';
import SocialLoginButton from '../common/SocialLoginButton';
import AuthDivider from '../common/AuthDivider';
import { useAuth } from '@/contexts/AuthContext';
import OtpVerificationForm from './OtpVerificationForm';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../../config/firebase";

const LoginForm = ({ 
  userType = "patient", // "patient", 'doctor', or 'admin'
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
      if (userType === "patient") {
        expectedRole = 'patient';
      } else if (userType === 'doctor' || userType === 'admin') {
        expectedRole = userType;
      }
      
      // Determine the redirect path
      const finalRedirectPath = getRedirectPath();
      
      const result = await login(email, password, rememberMe, expectedRole);
      
      if (result.success) {
        // If login is successful, redirect to the appropriate page
        if (result.needsVerification) {
          // If email verification is needed, show the verification form
          setNeedsVerification(true);
          setVerificationEmail(email);
          setIsLoading(false);
        } else {
          // Otherwise, redirect to the appropriate page
          router.push(finalRedirectPath);
        }
      } else if (result.error) {
        // Handle specific error cases
        if (result.error.includes('verification')) {
          setError('Email not verified. Please verify your email to continue.');
          setSuccessMessage('');
          
          // Offer to resend verification email
          const resendButton = document.createElement('button');
          resendButton.innerText = 'Resend verification email';
          resendButton.className = 'text-blue-600 hover:text-blue-800 underline mt-2';
          resendButton.onclick = async () => {
            try {
              const resendResult = await resendVerification(email);
              if (resendResult.success) {
                setSuccessMessage('Verification email sent! Please check your inbox.');
                setError('');
                
                // Show verification form
                setNeedsVerification(true);
                setVerificationEmail(email);
              } else {
                setError(resendResult.error || 'Failed to send verification email');
                setSuccessMessage('');
              }
            } catch (err) {
              setError('Failed to send verification email');
              setSuccessMessage('');
            }
          };
          
          // Append the button to the error message
          const errorElement = document.getElementById('login-error');
          if (errorElement) {
            errorElement.appendChild(resendButton);
          }
        } else {
          setError(result.error);
          setSuccessMessage('');
        }
        setIsLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setSuccessMessage('');
      setIsLoading(false);
      console.error(err);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Call the googleAuth function from AuthContext
      const authResult = await googleAuth(idToken, userType);
      
      if (authResult.success) {
        // Redirect based on user type after successful authentication
        const defaultRedirect = userType === 'doctor' ? '/doctor/dashboard' : '/';
        router.push(redirectPath || defaultRedirect);
      } else {
        setError(authResult.error || "Failed to authenticate with Google");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message || "Failed to sign in with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Replace the useEffect for Google Sign-In with a button click handler
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
            isLoading={isGoogleLoading}
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
