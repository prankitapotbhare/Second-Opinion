"use client";

import React from 'react';

const SuccessSkeleton = () => {
  return (
    <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
      <div className="animate-pulse">
        <div className="h-16 w-16 mx-auto bg-gray-200 rounded-full mb-6"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-6"></div>
        <div className="h-16 bg-gray-100 rounded-md w-full mb-6"></div>
        <div className="h-12 bg-gray-200 rounded-md w-full mb-3"></div>
        <div className="h-12 bg-gray-100 rounded-md w-full"></div>
      </div>
    </div>
  );
};

export default SuccessSkeleton;