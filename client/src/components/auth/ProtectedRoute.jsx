"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, hasRole, loading, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        // If not authenticated, redirect to login with the current path as redirect parameter
        const currentPath = window.location.pathname;
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      } else if (allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) {
        // If authenticated but doesn't have the required role
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, hasRole, loading, router, redirectTo, allowedRoles]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // If authenticated and has the required role, render the children
  if (isAuthenticated() && (allowedRoles.length === 0 || allowedRoles.some(role => hasRole(role)))) {
    return children;
  }

  // Return null while redirecting
  return null;
};

export default ProtectedRoute;