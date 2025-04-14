"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthHeader } from '../../components';
import PasswordInput from '../../components/common/PasswordInput';
import { AuthLoading } from '@/components';
import { validatePassword } from '@/utils/authUtils';

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, message: '' });

  useEffect(() => {
    // Validate token
    // This is a mock implementation
    setTimeout(() => {
      // Check if token is valid
      if (token && token.length > 10) {
        setIsValid(true);
      } else {
        setIsValid(false);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset password logic would go here in a real app
      console.log({ token, password });
      
      // Redirect to login page after successful reset
      router.push('/login/user?reset=success');
    } catch (err) {
      setError('An error occurred while resetting your password');
      console.error(err);
    } finally {
      setIsSubmitting(false);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h2>
          <p className="text-gray-600 mb-6">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <a href="/forgot-password" className="w-full inline-block py-3 px-4 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 text-center transition-colors">
            Request New Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <AuthHeader 
          title="Reset Your Password" 
          subtitle="Please enter a new password for your account"
          align="center"
        />
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <PasswordInput
              id="password"
              label="New Password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your new password"
              required
            />
            {!passwordValidation.isValid && password && (
              <p className="mt-1 text-sm text-red-600">{passwordValidation.message}</p>
            )}
          </div>
          
          <div>
            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}