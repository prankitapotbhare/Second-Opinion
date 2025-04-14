"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusMessage } from '../components';
import { useAuth } from '@/contexts/AuthContext';

export default function Logout() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const performLogout = async () => {
      try {
        const result = await logout();
        
        if (result.success) {
          // Start countdown for redirect
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                router.push('/');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          return () => clearInterval(timer);
        } else {
          setError(result.error || 'Failed to logout');
          setIsLoggingOut(false);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        setIsLoggingOut(false);
        console.error(err);
      }
    };
    
    performLogout();
  }, [logout, router]);

  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#E8F9FF] py-6 px-4 sm:px-6 lg:px-8">
        <StatusMessage
          status={countdown > 0 ? "success" : "loading"}
          title="Logging Out"
          message={
            countdown > 0 ? (
              <>
                <p className="text-gray-600 mb-4">You have been successfully logged out.</p>
                <p className="text-gray-500">Redirecting to home page in <span className="font-medium text-blue-600">{countdown}</span> seconds...</p>
              </>
            ) : (
              <p className="text-gray-600 mb-4">Redirecting you now...</p>
            )
          }
          primaryButton={{
            text: "Login again",
            href: "/login"
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E8F9FF] py-6 px-4 sm:px-6 lg:px-8">
      <StatusMessage
        status="error"
        title="Logout Failed"
        message={error}
        primaryButton={{
          text: "Try Again",
          onClick: () => {
            setIsLoggingOut(true);
            setError('');
            logout();
          }
        }}
        secondaryButton={{
          text: "Return to Home",
          onClick: () => router.push('/')
        }}
      />
    </div>
  );
}