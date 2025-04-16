"use client";

import React from 'react';
import Link from 'next/link';

const StatusMessage = ({
  status = 'success', // 'success', 'error', 'info', 'warning', 'loading'
  icon,
  title,
  message,
  alertContent,
  primaryButton,
  secondaryButton,
  autoFocus = false
}) => {
  // Default icons based on status
  const defaultIcons = {
    success: (
      <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    loading: (
      <svg className="animate-spin h-16 w-16 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    )
  };

  const statusColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-amber-500',
    loading: 'text-blue-600'
  };

  const statusRoles = {
    success: 'status',
    error: 'alert',
    info: 'status',
    warning: 'alert',
    loading: 'status'
  };

  // Use provided icon or default based on status
  const displayIcon = icon || defaultIcons[status];

  // Render button based on config
  const renderButton = (buttonConfig) => {
    if (!buttonConfig) return null;
    
    const { text, href, onClick, primary = false, disabled = false, isLoading = false } = buttonConfig;
    
    const buttonClasses = primary 
      ? "w-full py-3 px-4 mb-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      : "w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    
    const buttonContent = (
      <button 
        className={buttonClasses} 
        onClick={onClick} 
        disabled={disabled || isLoading}
        autoFocus={primary && autoFocus}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : text}
      </button>
    );
    
    if (href) {
      return (
        <Link href={href} className="block w-full">
          {buttonContent}
        </Link>
      );
    }
    
    return buttonContent;
  };

  return (
    <div 
      className="max-w-md w-full space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-md text-center" 
      role={statusRoles[status]} 
      aria-live={status === 'error' || status === 'warning' ? 'assertive' : 'polite'}
    >
      <div className={`mb-6 ${statusColors[status]}`}>
        {displayIcon}
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      
      {message && (
        <div className="text-gray-600 mb-6">
          {message}
        </div>
      )}
      
      {alertContent && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          {alertContent}
        </div>
      )}
      
      <div className="space-y-3">
        {primaryButton && renderButton({...primaryButton, primary: true})}
        {secondaryButton && renderButton(secondaryButton)}
      </div>
    </div>
  );
};

export default StatusMessage;