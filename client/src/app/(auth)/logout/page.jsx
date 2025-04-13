"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();
  
  useEffect(() => {
    // In a real app, you would handle logout logic here
    // For example, clearing tokens, cookies, etc.
    
    // Simulate logout process
    const performLogout = async () => {
      // Simulate API call to logout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to home page after logout
      router.push('/');
    };
    
    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Logging Out</h2>
        
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        
        <p className="text-gray-600">
          Please wait while we log you out...
        </p>
      </div>
    </div>
  );
}