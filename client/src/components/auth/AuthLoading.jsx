"use client";

import React from 'react';

export default function AuthLoading({ 
  message = "Loading...", 
  status = "loading", // loading, success, error
  errorMessage = "An error occurred",
  successMessage = "Operation completed successfully"
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        {status === "loading" && (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        )}
        
        {status === "success" && (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        
        {status === "error" && (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        
        <p className={`mt-4 ${
          status === "loading" ? "text-gray-600" : 
          status === "success" ? "text-green-600" : 
          "text-red-600"
        }`}>
          {status === "loading" ? message : 
           status === "success" ? successMessage : 
           errorMessage}
        </p>
      </div>
    </div>
  );
}