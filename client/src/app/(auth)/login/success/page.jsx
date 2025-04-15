"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import { SuccessMessage, SuccessSkeleton } from '../../components';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const userType = searchParams.get('type') || 'user';
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // Countdown timer for better UX
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect based on user type and redirect parameter
          if (userType === 'user' && redirectTo !== '/') {
            router.push(redirectTo);
          } else {
            router.push(
              userType === 'doctor' ? '/doctor/dashboard' : 
              userType === 'admin' ? '/admin/dashboard' : 
              '/'
            );
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [router, redirectTo, userType]);

  const alertContent = (
    <div className="flex items-center justify-center">
      <div className="flex-shrink-0 mr-3">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      <p className="text-blue-800 text-sm">
        Redirecting {redirectTo !== '/' ? 'to your requested page' : 'to home page'} in <span className="font-semibold">{countdown}</span> {countdown === 1 ? 'second' : 'seconds'}...
      </p>
    </div>
  );

  return (
    <SuccessMessage
      icon={<FaCheckCircle className="h-16 w-16 mx-auto" />}
      title="Login Successful!"
      message="Welcome back! You are now logged in."
      alertContent={alertContent}
      primaryButtonText={redirectTo !== '/' ? "Go to Requested Page" : "Go to Home Page"}
      primaryButtonAction={() => router.push(redirectTo !== '/' ? redirectTo : '/')}
      secondaryButtonText="Return to Home"
      secondaryButtonAction={() => router.push('/')}
    />
  );
}

export default function LoginSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<SuccessSkeleton />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}