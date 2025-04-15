"use client";

import React from 'react';
import Navbar from '@/components/common/Navbar';

export default function ResponsesLayout({ children }) {
  // Empty function since we don't need FAQs scrolling on response pages
  const dummyScrollFunction = () => {};
  
  return (
    <div className="min-h-screen bg-white">
      {/* Use the Navbar component with simplified navigation */}
      <Navbar 
        scrollToFAQs={dummyScrollFunction} 
        simplifiedNav={true} // Pass prop to indicate simplified navigation
      />

      {children}
    </div>
  );
}