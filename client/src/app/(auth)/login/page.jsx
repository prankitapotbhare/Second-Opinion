"use client";

import React from 'react';
import Link from 'next/link';
import { FaUserAlt, FaUserMd, FaUserCog } from 'react-icons/fa';

export default function LoginSelector() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F9FF] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-r from-teal-50 to-blue-50">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Welcome Back</h2>
          <p className="text-sm sm:text-base text-gray-600">Choose your account type to continue</p>
        </div>
        
        {/* Account Options */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* User Login Option */}
            <Link href="/login/user" className="block">
              <div className="group border border-blue-200 hover:border-blue-500 rounded-lg p-3 sm:p-4 transition-all hover:shadow-md flex items-center">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full group-hover:bg-blue-200 transition-colors mr-3 sm:mr-4 flex-shrink-0">
                  <FaUserAlt className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1 truncate">User Login</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Access your healthcare account</p>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Doctor Login Option */}
            <Link href="/login/doctor" className="block">
              <div className="group border border-green-200 hover:border-green-500 rounded-lg p-3 sm:p-4 transition-all hover:shadow-md flex items-center">
                <div className="bg-green-100 p-2 sm:p-3 rounded-full group-hover:bg-green-200 transition-colors mr-3 sm:mr-4 flex-shrink-0">
                  <FaUserMd className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1 truncate">Doctor Login</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Access your professional dashboard</p>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Admin Login Option */}
            <Link href="/login/admin" className="block">
              <div className="group border border-purple-200 hover:border-purple-500 rounded-lg p-3 sm:p-4 transition-all hover:shadow-md flex items-center">
                <div className="bg-purple-100 p-2 sm:p-3 rounded-full group-hover:bg-purple-200 transition-colors mr-3 sm:mr-4 flex-shrink-0">
                  <FaUserCog className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1 truncate">Admin Login</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Access the administration panel</p>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Footer Section */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs sm:text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}