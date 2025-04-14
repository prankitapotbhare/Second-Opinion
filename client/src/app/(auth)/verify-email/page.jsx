"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLoading } from '@/components';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const { verifyEmail } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('No verification token provided');
        setIsVerifying(false);
        return;
      }

      try {
        const result = await verifyEmail(token);
        
        if (result.success) {
          setIsSuccess(true);
        } else {
          setError(result.error || 'Invalid or expired verification link');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyToken();
  }, [token, verifyEmail]);

  if (isVerifying) {
    return <AuthLoading message="Verifying your email address..." />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
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
            <Link href="/login">
              <button className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors">
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
              {error}
            </p>
            <div className="space-y-3">
              <Link href="/signup">
                <button className="w-full py-3 px-4 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors">
                  Try Signing Up Again
                </button>
              </Link>
              <Link href="/">
                <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors">
                  Return to Home
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}