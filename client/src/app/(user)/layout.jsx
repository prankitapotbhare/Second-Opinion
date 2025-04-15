"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/common/Navbar';

export default function UserLayout({ children }) {
  // Empty function since we don't need FAQs scrolling on user pages
  const dummyScrollFunction = () => {};

  return (
    <ProtectedRoute allowedRoles={['user']} redirectTo="/login/user">
      <div className="min-h-screen bg-gray-50">
        {/* Add simplified Navbar to all user pages */}
        <Navbar 
          scrollToFAQs={dummyScrollFunction} 
          simplifiedNav={true}
        />
        {children}
      </div>
    </ProtectedRoute>
  );
}