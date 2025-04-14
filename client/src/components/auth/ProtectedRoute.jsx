"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components';

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        router.push(redirectTo);
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
        // User is logged in but doesn't have the required role
        router.push('/unauthorized');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [currentUser, isLoading, router, redirectTo, allowedRoles]);

  if (isLoading || !isAuthorized) {
    // Center the loading spinner in the full viewport
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <LoadingSpinner fullScreen={false} size="large" color="blue" />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;