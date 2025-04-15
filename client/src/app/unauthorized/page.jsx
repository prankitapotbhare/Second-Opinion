"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <FaExclamationTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Please contact an administrator if you believe this is an error.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => router.push('/')}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-150 ease-in-out"
              >
                Return to Home
              </button>
              
              <button
                onClick={() => router.back()}
                className="w-full py-2 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition duration-150 ease-in-out"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 sm:px-8">
          <p className="text-sm text-gray-500 text-center">
            If you need assistance, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}