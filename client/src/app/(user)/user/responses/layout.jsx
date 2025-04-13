"use client";

import React from 'react';
import Link from 'next/link';

export default function ResponsesLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-16 py-4 border-b border-gray-200">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-xl font-medium">
            <span className="text-teal-600">Second</span> opinion
          </h1>
        </div>
        
        <nav className="flex flex-wrap items-center gap-4 md:gap-8 mb-4 md:mb-0">
          <Link href="/" className="text-gray-600 hover:text-teal-600">Home</Link>
          <Link href="/user/responses" className="text-teal-600 font-medium">Response</Link>
          <Link href="/login" className="text-gray-600 hover:text-teal-600">Login</Link>
          <Link href="/signup" className="text-gray-600 hover:text-teal-600">Signup</Link>
          <Link href="/faqs" className="text-gray-600 hover:text-teal-600">FAQs</Link>
        </nav>
        
        <Link href="/contact">
          <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors whitespace-nowrap">
            Contact us
          </button>
        </Link>
      </header>

      {children}
    </div>
  );
}