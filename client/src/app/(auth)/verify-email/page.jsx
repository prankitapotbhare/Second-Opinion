"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StatusMessage } from '../components';
import { AuthLoading } from '@/components';
import { useAuth } from '@/contexts/AuthContext';

// Create a separate component for the verification content
function VerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
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
    
    // Only run verification if we have a token
    if (token) {
      verifyToken();
    } else {
      setError('No verification token provided');
      setIsVerifying(false);
    }
  }, [token, verifyEmail]);

  if (isVerifying) {
    return <AuthLoading message="Verifying your email address..." />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {isSuccess ? (
        <StatusMessage
          status="success"
          title="Email Verified!"
          message="Your email has been successfully verified. You can now log in to your account."
          primaryButton={{
            text: "Go to Login",
            href: "/login"
          }}
        />
      ) : (
        <StatusMessage
          status="error"
          title="Verification Failed"
          message={error}
          primaryButton={{
            text: "Try Signing Up Again",
            href: "/signup"
          }}
          secondaryButton={{
            text: "Return to Home",
            href: "/"
          }}
        />
      )}
    </div>
  );
}

// Main page component with Suspense boundary
export default function VerifyEmail() {
  return (
    <Suspense fallback={<AuthLoading message="Loading verification page..." />}>
      <VerificationContent />
    </Suspense>
  );
}