"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthHeader } from '../components';
import { useAuth } from '@/contexts/AuthContext';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { validateEmail } from '@/utils/authUtils';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the resetPassword function from the auth context
      const result = await resetPassword(email);
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Failed to send reset link');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#E8F9FF] p-4 sm:p-6 overflow-auto">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5 sm:p-6 md:p-8">
        <div className="mb-4">
          <Link href="/login/user" className="inline-flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <FaArrowLeft className="mr-1.5 text-xs" /> Back to Login
          </Link>
        </div>

        <AuthHeader 
          title="Reset Your Password" 
          subtitle="Enter your email and we'll send you a link to reset your password"
          align="left"
        />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-md my-4 text-xs sm:text-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-3">
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center mt-4">
            <div className="mb-3 sm:mb-4 text-green-500">
              <svg className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
              We've sent a password reset link to <span className="font-medium">{email}</span>. 
              Please check your inbox and click the link to reset your password.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 sm:p-4 mb-4 sm:mb-6 text-left">
              <p className="text-blue-800 text-xs sm:text-sm">
                <i className="fas fa-info-circle mr-1.5"></i>
                If you don't see the email in your inbox, please check your spam folder.
              </p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <Link href="/login" className="block w-full">
                <button className="w-full mb-2 py-2 px-4 bg-teal-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-teal-700 transition-colors">
                  Return to Login
                </button>
              </Link>
              <button 
                onClick={() => setIsSubmitted(false)} 
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Try Another Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}