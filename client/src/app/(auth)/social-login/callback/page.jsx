"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SocialLoginCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  
  // Get provider and any error from URL
  const provider = searchParams.get('provider') || 'unknown';
  const errorParam = searchParams.get('error');
  
  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // In a real app, you would process the OAuth token here
        // For now, we'll simulate a successful login after a delay
        if (errorParam) {
          throw new Error(errorParam);
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Redirect to success page
        router.push('/login/success?type=patient');
      } catch (err) {
        setError(err.message || 'Authentication failed');
        setIsProcessing(false);
      }
    };
    
    handleCallback();
  }, [router, errorParam]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mb-6 text-red-500">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
          
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Processing {provider} Login</h2>
        
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        
        <p className="text-gray-600">
          Please wait while we authenticate your account...
        </p>
      </div>
    </div>
  );
}