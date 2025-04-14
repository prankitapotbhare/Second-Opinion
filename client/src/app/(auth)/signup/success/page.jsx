"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const userType = searchParams.get('type') || 'patient';

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
      <div className="mb-6 text-green-500">
        <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
      
      <p className="text-gray-600 mb-6">
        We've sent a verification email to <span className="font-medium">{email}</span>. 
        Please check your inbox and click the verification link to activate your account.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <i className="fas fa-info-circle mr-2"></i>
          If you don't see the email in your inbox, please check your spam folder.
        </p>
      </div>
      
      <div className="space-y-3">
        <Link href={`/login/${userType}`}>
          <button className="w-full mb-2 py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800">
            Go to Login
          </button>
        </Link>
        
        <button 
          onClick={() => window.location.reload()} 
          className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
        >
          Resend Verification Email
        </button>
      </div>
    </div>
  );
}

export default function SignupSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 mx-auto bg-gray-200 rounded-full mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-6"></div>
            <div className="h-16 bg-gray-100 rounded-md w-full mb-6"></div>
            <div className="h-12 bg-gray-200 rounded-md w-full mb-3"></div>
            <div className="h-12 bg-gray-100 rounded-md w-full"></div>
          </div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}