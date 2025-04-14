"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthHeader } from '../components';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setIsSubmitted(true);
        // In a real app, we would redirect to a confirmation page
        // For mock purposes, we'll just show a success message
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8F9FF] p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-center text-gray-600">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <i className="fas fa-info-circle mr-2"></i>
                If you don't see the email in your inbox, please check your spam folder.
              </p>
            </div>
            
            <div className="space-y-3">
              <Link href="/login">
                <button className="w-full mb-2 py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800">
                  Return to Login
                </button>
              </Link>
              
              <button 
                onClick={() => setIsSubmitted(false)}
                className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
              >
                Try Another Email
              </button>
            </div>
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
            title="Forgot Password" 
            subtitle="Enter your email to receive a password reset link"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}