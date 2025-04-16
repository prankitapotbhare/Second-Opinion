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
  const email = searchParams?.get('email');
  const { verifyEmail, resendVerification } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Handle resend verification email
  const handleResendVerification = async () => {
    if (!email) {
      setError('Email address is required to resend verification');
      return;
    }

    setIsResending(true);
    try {
      const result = await resendVerification(email);
      
      if (result.success) {
        setResendSuccess(true);
      } else {
        setError(result.error || 'Failed to resend verification email');
      }
    } catch (err) {
      setError('An unexpected error occurred while resending verification');
      console.error(err);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const verifyToken = async () => {
      if (!token) {
        if (isMounted) {
          setError('No verification token provided');
          setIsVerifying(false);
        }
        return;
      }

      try {
        const result = await verifyEmail(token);
        
        if (isMounted) {
          if (result.success) {
            setIsSuccess(true);
          } else {
            setError(result.error || 'Invalid or expired verification link');
          }
          setIsVerifying(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('An unexpected error occurred');
          setIsVerifying(false);
          console.error(err);
        }
      }
    };
    
    // Only run verification if we have a token
    if (token) {
      verifyToken();
    } else {
      setError('No verification token provided');
      setIsVerifying(false);
    }

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [token]); // Remove verifyEmail from dependencies to prevent infinite loop

  if (isVerifying) {
    return <AuthLoading message="Verifying your email address..." />;
  }

  if (resendSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <StatusMessage
          status="success"
          title="Verification Email Sent!"
          message="A new verification email has been sent to your email address. Please check your inbox and click the verification link."
          primaryButton={{
            text: "Go to Login",
            href: "/login"
          }}
          secondaryButton={{
            text: "Return to Home",
            href: "/"
          }}
        />
      </div>
    );
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
            text: email ? "Resend Verification Email" : "Go to Login",
            onClick: email ? handleResendVerification : undefined,
            href: email ? undefined : "/login",
            loading: isResending
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