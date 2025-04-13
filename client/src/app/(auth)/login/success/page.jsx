"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const userType = searchParams.get('type') || 'patient';
  
  useEffect(() => {
    // Simulate loading and then redirect
    const timer = setTimeout(() => {
      router.push(userType === 'doctor' ? '/doctor/dashboard' : 
                 userType === 'admin' ? '/admin/dashboard' : 
                 '/patient/dashboard');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [router, redirectTo, userType]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6 text-green-500">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
        
        <p className="text-gray-600 mb-6">
          Welcome back! You are now logged in.
        </p>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
        
        <p className="text-gray-500 mt-4">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
}