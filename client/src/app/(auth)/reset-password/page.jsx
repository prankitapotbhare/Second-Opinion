"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthHeader, ResetPasswordForm, StatusMessage } from '../components';
import { AuthLoading } from '@/components';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (isLoading) {
    return <AuthLoading message="Validating your reset link..." />;
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <StatusMessage
          status="error"
          title="Invalid Reset Link"
          message={error}
          primaryButton={{
            text: "Request New Reset Link",
            href: "/forgot-password"
          }}
          secondaryButton={{
            text: "Back to Login",
            href: "/login"
          }}
        />
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
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}