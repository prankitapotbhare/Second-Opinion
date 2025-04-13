"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function UserLayout({ children }) {
  const router = useRouter();
  const { currentUser, loading, hasRole } = useAuth();

  // Check authentication and role
  React.useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push('/login/user');
      } else if (!hasRole('user')) {
        // If user is logged in but not a regular user, redirect to their appropriate dashboard
        router.push(`/${currentUser.role}/dashboard`);
      }
    }
  }, [currentUser, loading, router, hasRole]);

  // Show loading state while checking authentication
  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If authenticated as user, render the children
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}