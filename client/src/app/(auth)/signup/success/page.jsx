"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SuccessMessage, SuccessSkeleton } from '../../components';

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const userType = searchParams.get('type') || 'patient';

  const successIcon = (
    <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const alertContent = (
    <p className="text-blue-800 text-sm">
      <i className="fas fa-info-circle mr-2"></i>
      If you don't see the email in your inbox, please check your spam folder.
    </p>
  );

  return (
    <SuccessMessage
      icon={successIcon}
      title="Registration Successful!"
      message={
        <>
          We've sent a verification email to <span className="font-medium break-all">{email}</span>. 
          Please check your inbox and click the verification link to activate your account.
        </>
      }
      alertContent={alertContent}
      primaryButtonText="Go to Login"
      primaryButtonHref={`/login/${userType}`}
      isLink={true}
      secondaryButtonText="Resend Verification Email"
      secondaryButtonAction={() => window.location.reload()}
    />
  );
}

export default function SignupSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<SuccessSkeleton />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}