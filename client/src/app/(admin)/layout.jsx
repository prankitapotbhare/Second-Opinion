"use client";

import React from 'react';
import { Sidebar } from './components';
import { FaBars } from 'react-icons/fa';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { useAuth } from "@/contexts/AuthContext";

// Create a wrapper component that uses the context
const AdminLayoutContent = ({ children }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useAdmin();

  return (
    <div className="flex h-screen bg-[#f0f8ff] overflow-hidden">
      {/* Mobile sidebar toggle - only show when sidebar is closed */}
      {!isSidebarOpen && (
        <button 
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar />

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
  // If params is available, unwrap it
  const unwrappedParams = params ? React.use(params) : null;
  
  return (
    <AdminProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AdminProvider>
  );
}