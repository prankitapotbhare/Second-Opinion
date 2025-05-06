"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AdminProvider } from '@/contexts/AdminContext';

export default function AdminLayout({ children, params }) {
  return (
    <AdminProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Main content */}
        <ProtectedRoute allowedRoles={['admin']} redirectTo="/login/admin">
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </ProtectedRoute>
      </div>
    </AdminProvider>
  );
}