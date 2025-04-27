"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthHeader } from '../components';
import OtpVerificationForm from '../components/forms/OtpVerificationForm';
import { AuthLoading } from '@/components';

// Create a client component that uses useSearchParams
function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const redirectTo = searchParams.get('redirect') || '/';
  const userType = searchParams.get('type') || "patient";

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8F9FF] p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
            <p className="mt-2 text-gray-600">No email address provided for verification.</p>
            <div className="mt-6">
              <a 
                href="/login" 
                className="inline-block px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800"
              >
                Back to Login
              </a>
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
            title="Verify Your Email" 
            subtitle="Enter the verification code sent to your email"
            align="center"
          />
        </div>
        
        <div className="p-4 sm:p-6">
          <OtpVerificationForm 
            email={email}
            redirectPath={redirectTo}
          />
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function VerifyOtp() {
  return (
    <Suspense fallback={<AuthLoading message="Loading verification page..." />}>
      <VerifyOtpContent />
    </Suspense>
  );
}