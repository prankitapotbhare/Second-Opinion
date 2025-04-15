"use client";

import React from 'react';

const LoadingSpinner = ({ fullScreen = true, size = 'medium', color = 'green' }) => {
  // Size classes
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };
  
  // Color classes
  const colorClasses = {
    green: 'border-green-500',
    blue: 'border-blue-500',
    indigo: 'border-indigo-500',
    teal: 'border-teal-500',
    red: 'border-red-500'
  };
  
  const spinnerClass = `animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 ${colorClasses[color]}`;
  
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={spinnerClass}></div>
      </div>
    );
  }
  
  return <div className={spinnerClass}></div>;
};

export default LoadingSpinner;