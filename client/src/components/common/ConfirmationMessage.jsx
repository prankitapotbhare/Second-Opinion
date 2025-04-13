"use client";

import React from 'react';
import Link from 'next/link';
import { FaCheck } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

const ConfirmationMessage = ({ 
  title = "Confirmed!",
  message = "Your request has been successfully processed.",
  details = [],
  primaryButtonText = "Return to Home",
  primaryButtonLink = "/",
  secondaryButtonText = "Go to Dashboard",
  secondaryButtonLink,
  showSecondaryButton = true
}) => {
  const { currentUser } = useAuth();
  
  // If secondaryButtonLink is not provided, use the user's dashboard
  const dashboardLink = secondaryButtonLink || (currentUser ? `/${currentUser.role}/dashboard` : '/dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FaCheck className="text-2xl text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {details.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            {details.map((detail, index) => (
              <div key={index} className="flex justify-between mb-2 last:mb-0">
                <span className="text-gray-500">{detail.label}:</span>
                <span className="font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="space-y-3">
          <Link href={primaryButtonLink}>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              {primaryButtonText}
            </button>
          </Link>
          
          {showSecondaryButton && (
            <Link href={dashboardLink}>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                {secondaryButtonText}
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationMessage;