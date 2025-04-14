"use client";

import React from 'react';
import Link from 'next/link';

const AccountSelector = ({ 
  title, 
  subtitle, 
  options, 
  footerText, 
  footerLinkText, 
  footerLinkHref 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F9FF] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-r from-teal-50 to-blue-50">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{title}</h2>
          <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
        </div>
        
        {/* Account Options */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {options.map((option, index) => (
              <Link href={option.href} className="block" key={index}>
                <div className={`group border border-${option.color}-200 hover:border-${option.color}-500 rounded-lg p-4 transition-all hover:shadow-md flex items-center`}>
                  <div className={`bg-${option.color}-100 p-3 rounded-full group-hover:bg-${option.color}-200 transition-colors mr-4 flex-shrink-0`}>
                    {option.icon}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 truncate">{option.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{option.description}</p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <svg className={`h-5 w-5 text-gray-400 group-hover:text-${option.color}-500 transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Footer Section */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-center text-gray-600">
            {footerText}{' '}
            <Link href={footerLinkHref} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSelector;