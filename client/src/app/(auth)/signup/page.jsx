"use client";

import React from 'react';
import Link from 'next/link';
import { FaUserAlt, FaUserMd } from 'react-icons/fa';

export default function SignupSelector() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F9FF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h2>
          <p className="text-gray-600">Choose how you want to join Second Opinion</p>
        </div>
        
        <div className="grid grid-cols-1 gap-5 mb-8">
          <Link href="/signup/user" className="block">
            <div className="group border-2 border-blue-200 hover:border-blue-500 rounded-lg p-5 transition-all hover:shadow-md flex items-center">
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors mr-4">
                <FaUserAlt className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-1">Sign Up as User</h3>
                <p className="text-gray-600 text-sm">Get expert medical opinions and manage your health records</p>
              </div>
              <div className="ml-auto">
                <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
          
          <Link href="/signup/doctor" className="block">
            <div className="group border-2 border-green-200 hover:border-green-500 rounded-lg p-5 transition-all hover:shadow-md flex items-center">
              <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors mr-4">
                <FaUserMd className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-1">Sign Up as Doctor</h3>
                <p className="text-gray-600 text-sm">Provide your expertise and help patients with second opinions</p>
              </div>
              <div className="ml-auto">
                <svg className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}