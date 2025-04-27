"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AdminProvider } from '@/contexts/AdminContext';

// Create a wrapper component that uses the context
const AdminLayoutContent = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Main content */}
      <ProtectedRoute allowedRoles={['admin']} redirectTo="/login/admin">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </ProtectedRoute>
    </div>
  );
};

export default function AdminLayout({ children, params }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AdminProvider>
  );
}