"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthHeader } from '../components';
import PasswordInput from '../components/common/PasswordInput';
import { AuthLoading } from '@/components';
import { validatePassword } from '@/utils/authUtils';
import { useAuth } from '@/contexts/AuthContext';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const { setNewPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, message: '' });

  useEffect(() => {
    // Validate token
    if (!token) {
      setIsValid(false);
      setError('No reset token provided. Please check your email link.');
      setIsLoading(false);
      return;
    }

    // This is a mock implementation
    setTimeout(() => {
      // Check if token is valid
      if (token && token.length > 10) {
        setIsValid(true);
      } else {
        setIsValid(false);
        setError('Invalid or expired reset token. Please request a new password reset link.');
      }
      setIsLoading(false);
    }, 1000);
  }, [token]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Validate password as user types
    if (newPassword) {
      const validation = validatePassword(newPassword);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation({ isValid: true, message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await setNewPassword(token, password);
      
      if (result.success) {
        // Redirect to login page with success message
        router.push('/login?message=Your+password+has+been+reset+successfully');
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsSubmitting(false);
      console.error(err);
    }
  };

  if (isLoading) {
    return <AuthLoading message="Validating your reset link..." />;
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mb-4 text-red-500">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <a href="/forgot-password">
              <button className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800">
                Request New Reset Link
              </button>
            </a>
            <a href="/login">
              <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50">
                Back to Login
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F9FF] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <AuthHeader 
            title="Reset Your Password" 
            subtitle="Create a new password for your account"
            align="center"
          />
        </div>
        
        <div className="p-4 sm:p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Create a new password"
                label="New Password"
              />
              
              {!passwordValidation.isValid && password && (
                <div className="text-xs text-amber-600 px-1">
                  {passwordValidation.message}
                </div>
              )}
              
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                label="Confirm Password"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}