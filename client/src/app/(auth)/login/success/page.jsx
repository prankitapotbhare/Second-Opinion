"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const userType = searchParams.get('type') || 'user';
  const [countdown, setCountdown] = useState(10);
  
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
    <div className="min-h-screen flex items-center justify-center bg-[#E8F9FF] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-r from-teal-50 to-blue-50">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 sm:mb-6 text-green-500">
              <FaCheckCircle className="h-16 w-16 sm:h-20 sm:w-20" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
              Login Successful!
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 mb-4 text-center">
              Welcome back! You are now logged in.
            </p>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
              <div>
                <p className="text-sm sm:text-base text-blue-800">
                  Redirecting to your dashboard in <span className="font-semibold">{countdown}</span> {countdown === 1 ? 'second' : 'seconds'}...
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              onClick={() => router.push(`/${userType}/dashboard`)}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm sm:text-base font-medium rounded-md transition-colors"
            >
              Go to Dashboard Now
            </button>
            
            <button 
              onClick={() => router.push('/')}
              className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}