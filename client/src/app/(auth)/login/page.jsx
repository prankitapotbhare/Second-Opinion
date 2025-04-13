"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginSelector() {
  const router = useRouter();

  // Redirect to u login by default after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login/user');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Choose Login Type</h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <Link href="/login/user">
            <button className="w-full py-4 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
              User Login
            </button>
          </Link>
          
          <Link href="/login/doctor">
            <button className="w-full py-4 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors">
              Doctor Login
            </button>
          </Link>
          
          <Link href="/login/admin">
            <button className="w-full py-4 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors">
              Admin Login
            </button>
          </Link>
        </div>
        
        <p className="text-gray-600">
          Redirecting to u login in a few seconds...
        </p>
      </div>
    </div>
  );
}