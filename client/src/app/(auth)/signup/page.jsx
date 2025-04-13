"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupSelector() {
  const router = useRouter();

  // Redirect to patient signup by default after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/signup/user');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Create an Account</h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <Link href="/signup/user">
            <button className="w-full py-4 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
              Sign Up as Patient
            </button>
          </Link>
          
          <Link href="/signup/doctor">
            <button className="w-full py-4 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors">
              Sign Up as Doctor
            </button>
          </Link>
        </div>
        
        <p className="text-gray-600">
          Redirecting to patient signup in a few seconds...
        </p>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}