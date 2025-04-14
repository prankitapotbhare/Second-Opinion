"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function UserLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['user']} redirectTo="/login/user">
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ProtectedRoute>
  );
}