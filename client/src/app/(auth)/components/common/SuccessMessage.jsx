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
  secondaryButtonHref,
  isLoading = false
}) => {
  // Default icon if none provided
  const defaultIcon = (
    <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  // Render primary button based on props
  const renderPrimaryButton = () => {
    if (!primaryButtonText) return null;
    
    const buttonContent = (
      <button 
        className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : primaryButtonText}
      </button>
    );
    
    if (primaryButtonHref) {
      return (
        <Link href={primaryButtonHref} className="block w-full">
          {buttonContent}
        </Link>
      );
    }
    
    return React.cloneElement(buttonContent, { onClick: primaryButtonAction });
  };

  // Render secondary button based on props
  const renderSecondaryButton = () => {
    if (!secondaryButtonText) return null;
    
    const buttonContent = (
      <button 
        className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {secondaryButtonText}
      </button>
    );
    
    if (secondaryButtonHref) {
      return (
        <Link href={secondaryButtonHref} className="block w-full">
          {buttonContent}
        </Link>
      );
    }
    
    return React.cloneElement(buttonContent, { onClick: secondaryButtonAction });
  };

  return (
    <div className="max-w-md w-full space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-md text-center" role="alert" aria-live="polite">
      <div className="mb-6 text-green-500">
        {icon || defaultIcon}
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      
      {message && (
        <p className="text-gray-600 mb-6">
          {message}
        </p>
      )}
      
      {alertContent && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          {alertContent}
        </div>
      )}
      
      <div className="space-y-3">
        {renderPrimaryButton()}
        {renderSecondaryButton()}
      </div>
    </div>
  );
};

export default SuccessMessage;