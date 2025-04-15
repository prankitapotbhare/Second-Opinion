"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/common/Navbar';
import { usePathname } from 'next/navigation';

export default function UserLayout({ children }) {
  // Empty function since we don't need FAQs scrolling on user pages
  const dummyScrollFunction = () => {};

  const pathname = usePathname();

  // List of dashboard-related routes where Navbar should be hidden
  const dashboardRoutes = [
    "/user/dashboard",
    "/user/appointments",
    "/user/medical-records",
    "/user/profile",
    "/user/settings"
  ];

  // Hide Navbar if the current path matches any of the dashboard routes
  const hideNavbar = dashboardRoutes.includes(pathname);

  return (
    <ProtectedRoute allowedRoles={['user']} redirectTo="/login/user">
      <div className="min-h-screen bg-gray-50">
        {/* Conditionally render Navbar */}
        {!hideNavbar && (
          <Navbar 
            scrollToFAQs={dummyScrollFunction} 
            simplifiedNav={true}
          />
        )}
        {children}
      </div>
    </ProtectedRoute>
  );
}