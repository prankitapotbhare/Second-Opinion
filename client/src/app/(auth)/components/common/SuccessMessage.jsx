"use client";

import React from 'react';
import Link from 'next/link';

const SuccessMessage = ({
  icon,
  title,
  message,
  alertContent,
  primaryButtonText,
  primaryButtonAction,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonAction,
  isLink = false
}) => {
  const PrimaryButton = () => {
    if (isLink && primaryButtonHref) {
      return (
        <Link href={primaryButtonHref}>
          <button className="w-full mb-2 py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors">
            {primaryButtonText}
          </button>
        </Link>
      );
    }
    
    return (
      <button 
        onClick={primaryButtonAction}
        className="w-full mb-2 py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
      >
        {primaryButtonText}
      </button>
    );
  };

  return (
    <div className="max-w-md w-full space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
      <div className="mb-6 text-green-500">
        {icon}
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      
      {alertContent && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          {alertContent}
        </div>
      )}
      
      <div className="space-y-3">
        <PrimaryButton />
        
        {secondaryButtonText && (
          <button 
            onClick={secondaryButtonAction}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            {secondaryButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;