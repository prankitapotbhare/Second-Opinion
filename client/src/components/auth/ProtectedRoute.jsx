"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], // Array of allowed roles, empty means any authenticated user
  redirectTo = '/login' // Where to redirect if not authenticated
}) {
  const { currentUser, loading, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth is loaded
    if (!loading) {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push(redirectTo);
        return;
      }

      // If roles are specified, check if user has the required role
      if (allowedRoles.length > 0) {
        const hasAllowedRole = allowedRoles.some(role => hasRole(role));
        if (!hasAllowedRole) {
          // Redirect based on role
          if (hasRole('admin')) {
            router.push('/admin/dashboard');
          } else if (hasRole('doctor')) {
            router.push('/doctor/dashboard');
          } else {
            router.push('/user/dashboard');
          }
          return;
        }
      }
    }
  }, [loading, isAuthenticated, hasRole, allowedRoles, router, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not authenticated or not authorized, don't render children
  if (!isAuthenticated() || (allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role)))) {
    return null;
  }

  // If authenticated and authorized, render children
  return children;
}