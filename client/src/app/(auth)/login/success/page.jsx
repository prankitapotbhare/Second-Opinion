"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const userType = searchParams.get('type') || 'user';
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // Countdown timer for better UX
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect based on user type
          router.push(
            userType === 'doctor' ? '/doctor/dashboard' : 
            userType === 'admin' ? '/admin/dashboard' : 
            '/user/dashboard'
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [router, redirectTo, userType]);

  return (
    <div className="max-w-md w-full space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
      <div className="mb-6 text-green-500">
        <FaCheckCircle className="h-16 w-16 mx-auto" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
      
      <p className="text-gray-600 mb-6">
        Welcome back! You are now logged in.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="flex items-center justify-center">
          <div className="flex-shrink-0 mr-3">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-blue-800 text-sm">
            Redirecting to your dashboard in <span className="font-semibold">{countdown}</span> {countdown === 1 ? 'second' : 'seconds'}...
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <button 
          onClick={() => router.push(`/${userType}/dashboard`)}
          className="w-full mb-2 py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          Go to Dashboard Now
        </button>
        
        <button 
          onClick={() => router.push('/')}
          className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default function LoginSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
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