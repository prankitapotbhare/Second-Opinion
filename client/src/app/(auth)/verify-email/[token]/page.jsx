"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmail() {
  const { token } = useParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verify email token
    // This is a mock implementation
    setTimeout(() => {
      if (token && token.length > 10) {
        setIsSuccess(true);
      } else {
        setError('Invalid or expired verification link');
      }
      setIsVerifying(false);
    }, 1500);
  }, [token]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Your Email</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Please wait while we verify your email address...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        {isSuccess ? (
          <>
            <div className="mb-4 text-green-500">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now log in to your account.
            </p>
            <Link href="/login/patient">
              <button className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800">
                Go to Login
              </button>
            </Link>
          </>
        ) : (
          <>
            <div className="mb-4 text-red-500">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              {error || 'Something went wrong during verification.'}
            </p>
            <Link href="/signup/patient">
              <button className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800">
                Try Again
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}