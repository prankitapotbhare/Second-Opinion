"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login',
  publicRoutes = []
}) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  // Helper function to check if user is authenticated
  const isAuthenticated = () => !!currentUser;
  
  // Helper function to check if user has a specific role
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  // Helper function to check if current path is a public route
  const isPublicRoute = (path) => {
    return publicRoutes.some(route => {
      // Check for exact match or if the route is a prefix pattern with wildcard
      if (route.endsWith('/*')) {
        const baseRoute = route.slice(0, -2); // Remove the /* part
        return path === baseRoute || path.startsWith(baseRoute + '/');
      }
      return path === route;
    });
  };

  useEffect(() => {
    // Don't do anything while still loading
    if (loading) return;

    // Check if the current path is a public route
    const isPublic = isPublicRoute(pathname);
    
    if (isPublic) {
      // Public routes are always authorized
      setAuthorized(true);
      return;
    }
    
    // For protected routes, check authentication and role
    if (!isAuthenticated()) {
      // Redirect to login with the current path as redirect parameter
      router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
      setAuthorized(false);
    } else if (allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) {
      // If authenticated but doesn't have the required role
      router.push('/unauthorized');
      setAuthorized(false);
    } else {
      // User is authenticated and has the required role
      setAuthorized(true);
    }
  }, [loading, pathname, router, redirectTo, allowedRoles, currentUser, publicRoutes]);

  // Show loading spinner while authentication is being checked
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render children only if authorized
  return authorized ? children : <LoadingSpinner />;
};

export default ProtectedRoute;