"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const router = useRouter();
  const { isAuthenticated, hasRole, loading, currentUser } = useAuth();

  useEffect(() => {
    // Wait until auth is loaded
    if (!loading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }
      
      // If a specific role is required and user doesn't have it
      if (requiredRole && !hasRole(requiredRole)) {
        // Redirect to the appropriate dashboard based on user role
        if (currentUser?.role) {
          router.push(`/${currentUser.role}/dashboard`);
        } else {
          router.push('/login');
        }
      }
    }
  }, [isAuthenticated, hasRole, loading, requiredRole, router, currentUser]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If authentication check is complete and user is authenticated with the required role
  if (!loading && isAuthenticated() && (!requiredRole || hasRole(requiredRole))) {
    return children;
  }

  // Return null while redirecting
  return null;
};

export default ProtectedRoute;