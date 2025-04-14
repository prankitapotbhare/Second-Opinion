"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components';
import { FaBars } from 'react-icons/fa';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { usePathname } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({ children, params }) {
  // If params is available, unwrap it
  const unwrappedParams = params ? React.use(params) : null;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentUser } = useAuth();
  const pathname = usePathname();

  // Set active tab based on current path
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const section = pathSegments[pathSegments.length - 1];
    
    if (section && ['dashboard', 'doctors', 'patients', 'appointments', 'settings'].includes(section)) {
      setActiveTab(section);
    }
  }, [pathname]);

  // Rest of the component remains the same
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
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main content */}
      <ProtectedRoute allowedRoles={['admin']} redirectTo="/login/admin">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </ProtectedRoute>
    </div>
  );
}