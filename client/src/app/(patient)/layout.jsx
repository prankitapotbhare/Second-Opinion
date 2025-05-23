"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {Navbar, Footer} from '@/components';
import { usePathname } from 'next/navigation';

export default function UserLayout({ children }) {
  // Empty function since we don't need FAQs scrolling on user pages
  const dummyScrollFunction = () => {};

  const pathname = usePathname();

  // List of dashboard-related routes where Navbar should be hidden
  const dashboardRoutes = [
    "/patient/dashboard",
    "/patient/appointments",
    "/patient/medical-records",
    "/patient/profile",
    "/patient/settings"
  ];

  // List of routes where Footer should be hidden
  const noFooterRoutes = [
    "/patient/response",
    "/patient/response/",
    "/patient/patient-details",
    "/patient/patient-details/",
  ];

  // Check if the current path starts with any of the routes in noFooterRoutes
  const hideFooter = noFooterRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Hide Navbar if the current path matches any of the dashboard routes
  const hideNavbar = dashboardRoutes.includes(pathname);

  return (
    <ProtectedRoute 
      allowedRoles={["patient"]} 
      redirectTo="/login/patient" 
      publicRoutes={[
        '/patient/doctors',
        '/patient/doctors/*',
        '/patient/patient-details'
      ]}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Conditionally render Navbar */}
        {!hideNavbar && (
          <Navbar 
            scrollToFAQs={dummyScrollFunction} 
            simplifiedNav={true}
          />
        )}
        {children}
        {/* Conditionally render Footer */}
        {!hideFooter && <Footer/>}
      </div>
    </ProtectedRoute>
  );
}