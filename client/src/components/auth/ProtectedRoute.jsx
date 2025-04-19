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
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // Helper function to check if user is authenticated
  const isAuthenticated = () => !!currentUser;
  
  // Helper function to check if user has a specific role
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

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
  }, [loading, router, redirectTo, allowedRoles, currentUser]);

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