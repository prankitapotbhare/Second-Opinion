"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthHeader, ResetPasswordForm, StatusMessage } from '../components';
import { AuthLoading } from '@/components';

// Create a separate component for the reset password content
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
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
    
    // Set loading to false since we have a token
    setIsLoading(false);
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
            title="Reset Password" 
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

// Main page component with Suspense boundary
export default function ResetPassword() {
  return (
    <Suspense fallback={<AuthLoading message="Loading reset password page..." />}>
      <ResetPasswordContent />
    </Suspense>
  );
}